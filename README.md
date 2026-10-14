# whats_server_tenda

Servidor HTTP simples para envio de mensagens via WhatsApp Web (não oficial), construído com Node.js, Express e `whatsapp-web.js`.

## Requisitos

- Node.js 18+
- Chromium (instalado automaticamente pelo Puppeteer)

## Instalação

```bash
npm install
```

## Configuração

Copie o arquivo de exemplo e preencha as variáveis:

```bash
cp .env.example .env
```

| Variável  | Descrição                                      | Padrão |
|-----------|------------------------------------------------|--------|
| `PORT`    | Porta em que o servidor HTTP irá escutar       | `3001` |
| `API_KEY` | Chave usada para autenticar as requisições     | —      |

## Uso

```bash
npm start
```

Na primeira execução, um QR Code será exibido no terminal. Escaneie com o WhatsApp do celular (WhatsApp → Aparelhos conectados → Conectar um aparelho) para autenticar. A sessão fica persistida em `./sessions` e não será necessário escanear novamente nas próximas execuções.

## Endpoints

Todas as requisições exigem o header `x-api-key` com o valor de `API_KEY`.

### `GET /status`

Retorna o estado do servidor.

```bash
curl -H "x-api-key: sua-chave" http://127.0.0.1:3001/status
```

### `POST /send`

Envia uma mensagem.

```bash
curl -X POST http://127.0.0.1:3001/send \
  -H "Content-Type: application/json" \
  -H "x-api-key: sua-chave" \
  -d '{"number": "5511999999999", "message": "Olá!"}'
```

| Campo     | Tipo   | Obrigatório | Descrição                                            |
|-----------|--------|-------------|------------------------------------------------------|
| `number`  | string | sim         | Número no formato `5511999999999` (com DDI e DDD) ou `5511999999999@c.us` |
| `message` | string | sim         | Texto da mensagem                                    |

## Avisos

- **Integração não oficial**: o `whatsapp-web.js` automatiza o WhatsApp Web e pode levar ao banimento/bloqueio da conta. Use uma conta dedicada.
- **Segurança**: mantenha o `API_KEY` seguro e nunca o versione no git (o `.env` já está no `.gitignore`).
- O servidor escuta apenas em `127.0.0.1`. Para expor externamente, use um proxy reverso com TLS.
