import axios from 'axios';
import { Empresa } from '@/app/[username]/action-get.user';

interface OdooSession {
  uid: number;
  session_id: string;
}

interface OdooLead {
  name: string;
  email_from: string;
  phone: string;
  description: string;
  date_deadline?: string;
  type?: string;
  stage_id?: number;
}

interface OdooContact {
  name: string;
  email: string;
  phone: string;
  is_company?: boolean;
}

export class OdooClient {
  private session: OdooSession | null = null;
  private cookies: string | null = null;

  constructor(private config: Empresa['ODOO']) {}

  private async authenticate(): Promise<void> {
    try {
      const response = await axios.post(
        `${this.config.url}/web/session/authenticate`,
        {
          jsonrpc: '2.0',
          params: {
            db: this.config.db,
            login: this.config.username,
            password: this.config.password,
          },
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.error) {
        throw new Error(`Error de autenticación: ${response.data.error.data.message}`);
      }

      this.session = {
        uid: response.data.result.uid,
        session_id: response.headers['set-cookie']?.[0]?.split(';')[0] || '',
      };

      this.cookies = response.headers['set-cookie']?.[0] || null;
    } catch (error) {
      console.error('Error en la autenticación:', error);
      throw error;
    }
  }

  private async makeRequest(endpoint: string, payload: any) {
    if (!this.session) {
      await this.authenticate();
    }

    try {
      const response = await axios.post(
        `${this.config.url}${endpoint}`,
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
            'Cookie': this.cookies || '',
          },
        }
      );

      if (response.data.error) {
        throw new Error(`Error en la petición: ${response.data.error.data.message}`);
      }

      return response.data.result;
    } catch (error) {
      console.error('Error en la petición:', error);
      throw error;
    }
  }

  async createLead(leadData: OdooLead): Promise<number> {
    try {
      // Primero obtenemos las etapas disponibles si no se especifica una
      if (!leadData.stage_id) {
        const stages = await this.makeRequest('/web/dataset/call_kw/crm.stage/search_read', {
          jsonrpc: '2.0',
          params: {
            model: 'crm.stage',
            method: 'search_read',
            args: [[]],
            kwargs: {
              fields: ['id', 'name'],
            },
          },
        });

        // Usar la etapa configurada en la empresa o la primera disponible
        leadData.stage_id = this.config.stage_id || stages[0].id;
      }

      // Crear el lead
      const leadId = await this.makeRequest('/web/dataset/call_kw/crm.lead/create', {
        jsonrpc: '2.0',
        params: {
          model: 'crm.lead',
          method: 'create',
          args: [{
            ...leadData,
            type: this.config.type || leadData.type || 'lead',
            user_id: this.session?.uid,
          }],
          kwargs: {},
        },
      });

      return leadId;
    } catch (error) {
      console.error('Error al crear el lead:', error);
      throw error;
    }
  }

  async createContact(contactData: OdooContact): Promise<number> {
    try {
      const contactId = await this.makeRequest('/web/dataset/call_kw/res.partner/create', {
        jsonrpc: '2.0',
        params: {
          model: 'res.partner',
          method: 'create',
          args: [{
            ...contactData,
            is_company: contactData.is_company || false,
            user_id: this.session?.uid,
          }],
          kwargs: {},
        },
      });

      return contactId;
    } catch (error) {
      console.error('Error al crear el contacto:', error);
      throw error;
    }
  }

  async assignLeadToContact(leadId: number, contactId: number): Promise<boolean> {
    try {
      await this.makeRequest('/web/dataset/call_kw/crm.lead/write', {
        jsonrpc: '2.0',
        params: {
          model: 'crm.lead',
          method: 'write',
          args: [
            [leadId],
            {
              partner_id: contactId,
              user_id: this.session?.uid,
            },
          ],
          kwargs: {},
        },
      });

      return true;
    } catch (error) {
      console.error('Error al asignar el lead al contacto:', error);
      throw error;
    }
  }
} 