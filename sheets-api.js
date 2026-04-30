/**
 * Google Sheets API Integration
 * Busca dados em tempo real da planilha compartilhada
 */

class GoogleSheetsAPI {
    constructor(spreadsheetId, apiKey) {
        this.spreadsheetId = spreadsheetId;
        this.apiKey = apiKey;
        this.baseUrl = 'https://sheets.googleapis.com/v4/spreadsheets';
        this.cache = {};
        this.cacheExpiry = 5 * 60 * 1000; // 5 minutos de cache
    }

    /**
     * Busca dados da planilha
     */
    async fetchData(range) {
        const cacheKey = `${this.spreadsheetId}:${range}`;
        const now = Date.now();

        // Verificar cache
        if (this.cache[cacheKey] && (now - this.cache[cacheKey].timestamp) < this.cacheExpiry) {
            console.log('📦 Usando dados em cache:', range);
            return this.cache[cacheKey].data;
        }

        try {
            const url = `${this.baseUrl}/${this.spreadsheetId}/values/${encodeURIComponent(range)}?key=${this.apiKey}`;
            console.log('🔄 Buscando dados da planilha:', range);

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`Erro HTTP: ${response.status} - ${response.statusText}`);
            }

            const data = await response.json();

            // Armazenar em cache
            this.cache[cacheKey] = {
                data: data.values || [],
                timestamp: now
            };

            console.log('✅ Dados carregados com sucesso:', range);
            return data.values || [];
        } catch (error) {
            console.error('❌ Erro ao buscar dados:', error);
            throw error;
        }
    }

    /**
     * Busca todas as abas (sheets) da planilha
     */
    async fetchAllSheets() {
        try {
            const url = `${this.baseUrl}/${this.spreadsheetId}?key=${this.apiKey}`;
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`Erro HTTP: ${response.status}`);
            }

            const data = await response.json();
            return data.sheets.map(sheet => sheet.properties.title);
        } catch (error) {
            console.error('❌ Erro ao buscar abas:', error);
            throw error;
        }
    }

    /**
     * Parser específico para o cronograma
     */
    async parseSchedule() {
        try {
            console.log('🔍 Buscando abas da planilha...');
            const sheets = await this.fetchAllSheets();
            console.log('📋 Abas encontradas:', sheets);

            if (!sheets || sheets.length === 0) {
                console.warn('⚠️ Nenhuma aba encontrada!');
                return {};
            }

            const schedule = {};

            // Processar TODAS as abas (não filtrar)
            for (const sheet of sheets) {
                console.log(`🔄 Processando aba: "${sheet}"`);
                
                const rows = await this.fetchData(`'${sheet}'!A:F`);
                console.log(`📊 Dados brutos de "${sheet}":`, rows);

                // Dividir dados por dia
                const daySchedules = this.parseScheduleByDay(rows);
                console.log(`✅ Eventos parseados de "${sheet}":`, daySchedules);

                Object.assign(schedule, daySchedules);
            }

            console.log('🎉 Schedule final:', schedule);
            return schedule;
        } catch (error) {
            console.error('❌ Erro ao fazer parse do cronograma:', error);
            throw error;
        }
    }

    /**
     * Parser que separa eventos por dia
     */
    parseScheduleByDay(rows) {
        if (!rows || rows.length < 2) return {};

        const schedule = {};
        let currentDay = null;
        let currentEvents = [];

        console.log('🔍 Procurando dias nos dados...');

        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            
            if (!row || !row[0]) continue;

            const firstCol = row[0].trim().toUpperCase();

            // Detectar cabeçalho de dia
            if (firstCol.includes('SEXTA') || firstCol.includes('SÁBADO') || firstCol.includes('DOMINGO')) {
                console.log(`📅 Dia encontrado: ${firstCol}`);

                // Salvar dia anterior se existir
                if (currentDay && currentEvents.length > 0) {
                    schedule[currentDay] = currentEvents;
                }

                currentDay = firstCol;
                currentEvents = [];
            }
            // Detectar header de colunas (Horário, Momento, Responsável, Local)
            else if (firstCol.includes('HORÁRIO') || firstCol.includes('HORA')) {
                console.log(`📊 Header encontrado para ${currentDay}`);
                continue;
            }
            // Processar evento
            else if (currentDay) {
                const event = this.parseEventRow(row);
                if (event && event.momento !== '-') {
                    currentEvents.push(event);
                }
            }
        }

        // Salvar último dia
        if (currentDay && currentEvents.length > 0) {
            schedule[currentDay] = currentEvents;
        }

        return schedule;
    }

    /**
     * Parser de uma linha de evento
     */
    parseEventRow(row) {
        if (!row || row.length < 1) return null;

        const event = {
            hora: (row[0] || '-').trim(),
            momento: (row[1] || '-').trim(),
            responsavel: (row[2] || '-').trim(),
            local: (row[3] || '-').trim(),
            resumo: (row[4] || '-').trim(),
            descricao: (row[5] || '-').trim()
        };

        // Só adicionar se houver algo preenchido
        if (event.momento !== '-' && event.momento !== '') {
            return event;
        }

        return null;
    }

    /**
     * Limpar cache
     */
    clearCache() {
        this.cache = {};
        console.log('🗑️ Cache limpo');
    }
}

/**
 * Carregador de dados com retry e fallback
 */
class ScheduleDataLoader {
    constructor(spreadsheetId, apiKey) {
        this.api = new GoogleSheetsAPI(spreadsheetId, apiKey);
        this.maxRetries = 3;
        this.retryDelay = 1000;
    }

    /**
     * Carregar dados com retry automático
     */
    async loadWithRetry() {
        for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
            try {
                console.log(`📡 Tentativa ${attempt}/${this.maxRetries}`);
                const data = await this.api.parseSchedule();
                console.log('🎉 Dados carregados com sucesso!', data);
                return data;
            } catch (error) {
                console.error(`❌ Tentativa ${attempt} falhou:`, error.message);

                if (attempt < this.maxRetries) {
                    const delay = this.retryDelay * attempt;
                    console.log(`⏳ Aguardando ${delay}ms antes de tentar novamente...`);
                    await new Promise(resolve => setTimeout(resolve, delay));
                } else {
                    console.error('💥 Todas as tentativas falharam');
                    throw error;
                }
            }
        }
    }

    /**
     * Configurar atualização automática
     */
    startAutoRefresh(callback, intervalMinutes = 5) {
        console.log(`⏰ Auto-refresh configurado para cada ${intervalMinutes} minuto(s)`);

        // Carregar na primeira vez
        this.loadWithRetry()
            .then(data => callback(data, null))
            .catch(error => callback(null, error));

        // Configurar intervalo
        setInterval(() => {
            this.api.clearCache();
            this.loadWithRetry()
                .then(data => {
                    console.log('🔄 Dados atualizados!');
                    callback(data, null);
                })
                .catch(error => callback(null, error));
        }, intervalMinutes * 60 * 1000);
    }
}

// Exportar para uso global
window.GoogleSheetsAPI = GoogleSheetsAPI;
window.ScheduleDataLoader = ScheduleDataLoader;
