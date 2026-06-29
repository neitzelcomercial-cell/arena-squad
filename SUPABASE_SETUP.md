# 🚀 GUIA DE CONFIGURAÇÃO — SUPABASE
## Sincronizar Arena Squad entre dispositivos

---

### 📋 O que você precisa
- ✅ Um **computador** com o arquivo `index.html`
- ✅ **10 minutos** de atenção
- ✅ **Navegador** (Chrome ou Edge)

---

## 🟢 PASSO 1: Criar conta no Supabase (grátis)

> **O que é Supabase?** É um banco de dados online grátis que vai guardar seus dados na nuvem.

```
┌─────────────────────────────────────────────┐
│                                             │
│  🌐 Abra o navegador e acesse:              │
│  ┌─────────────────────────────────────┐    │
│  │  https://supabase.com               │    │
│  └─────────────────────────────────────┘    │
│                                             │
│  📌 Clique no botão "Start your project"    │
│     (canto superior direito)                │
│                                             │
│  📌 Faça login com sua conta do GitHub      │
│     (Authorize at Supabase)                 │
│                                             │
│  ✅ PRONTO! Conta criada automaticamente     │
│                                             │
└─────────────────────────────────────────────┘
```

---

## 🟢 PASSO 2: Criar um projeto novo

Dentro do site do Supabase, siga:

```
┌─────────────────────────────────────────────┐
│                                             │
│  1. Clique em "New project"                 │
│                                             │
│  2. Preencha:                               │
│     ┌─────────────────────────────────┐     │
│     │ Name:      arena-squad         │     │
│     │ Database Password: [CRIE UMA]  │     │
│     │ Region:    South America       │     │
│     │            (escolha a mais     │     │
│     │             perto de você)     │     │
│     │ Pricing:   Free (grátis)       │     │
│     └─────────────────────────────────┘     │
│                                             │
│  ⚠️ IMPORTANTE: Anote a senha em um papel!  │
│     Você vai precisar depois                │
│                                             │
│  3. Clique em "Create new project"          │
│                                             │
│  ⏳ AGUARDE uns 2 minutos criando...         │
│     (faça um café ☕)                        │
│                                             │
│  ✅ Projeto criado!                          │
│                                             │
└─────────────────────────────────────────────┘
```

---

## 🟢 PASSO 3: Executar o SQL (criar as tabelas)

Agora vamos criar as tabelas do banco de dados:

```
┌─────────────────────────────────────────────┐
│                                             │
│  No menu à esquerda, clique em:             │
│                                             │
│  ┌─────────────────────────────────────────┐│
│  │  🗄️ SQL Editor                         ││
│  └─────────────────────────────────────────┘│
│                                             │
│  Depois clique em:                          │
│  ┌─────────────────────────────────────────┐│
│  │  ➕ New Query                           ││
│  └─────────────────────────────────────────┘│
│                                             │
│  Vai abrir uma tela em branco.              │
│                                             │
│  Agora ABRA o arquivo:                      │
│  ┌─────────────────────────────────────────┐│
│  │  📁 Pro. arena > supabase_schema.sql   ││
│  └─────────────────────────────────────────┘│
│                                             │
│  Copie TODO o conteúdo desse arquivo        │
│  (Ctrl+A > Ctrl+C)                          │
│                                             │
│  Cole na tela do SQL Editor                 │
│  (Ctrl+V)                                   │
│                                             │
│  Clique em:                                 │
│  ┌─────────────────────────────────────────┐│
│  │  ▶️ Run                                 ││
│  └─────────────────────────────────────────┘│
│                                             │
│  ✅ Se aparecer "Success. No rows returned" │
│     ou só "Success" — PARABÉNS!             │
│     As 5 tabelas foram criadas!             │
│                                             │
└─────────────────────────────────────────────┘
```

---

## 🟢 PASSO 4: Pegar as credenciais (URL + Chave)

Agora vamos pegar as informações para conectar seu site ao banco:

```
┌─────────────────────────────────────────────┐
│                                             │
│  No menu à esquerda, clique em:             │
│                                             │
│  ┌─────────────────────────────────────────┐│
│  │  ⚙️ Project Settings                   ││
│  └─────────────────────────────────────────┘│
│                                             │
│  Depois clique em:                          │
│  ┌─────────────────────────────────────────┐│
│  │  🔑 API                                 ││
│  └─────────────────────────────────────────┘│
│                                             │
│  VAI APARECER UMA TELA COM DUAS INFOS:      │
│                                             │
│  ┌─────────────────────────────────────────┐│
│  │  1. Project URL  ─── uma URL assim:     ││
│  │     https://xxxxx.supabase.co           ││
│  │                                         ││
│  │  2. anon public  ─── um textão:         ││
│  │     eyJhbGciOiJIUzI1Ni...              ││
│  └─────────────────────────────────────────┘│
│                                             │
│  📋 Copie a URL (primeira info)             │
│  📋 Copie a chave anon (segunda info)       │
│                                             │
└─────────────────────────────────────────────┘
```

Agora cole no arquivo `supabase-sync.js`:

```
┌─────────────────────────────────────────────┐
│  📁 Abra o arquivo no bloco de notas:       │
│  Pro. arena > supabase-sync.js             │
│                                             │
│  Altere estas duas linhas (linhas 7 e 8):   │
│                                             │
│  ANTES:                                      │
│  ┌─────────────────────────────────────────┐│
│  │ SUPABASE_URL = 'https://SEU_PROJETO...' ││
│  │ SUPABASE_ANON_KEY = 'eyJhbG...AQUI'    ││
│  └─────────────────────────────────────────┘│
│                                             │
│  DEPOIS (com seus dados):                   │
│  ┌─────────────────────────────────────────┐│
│  │ SUPABASE_URL = 'https://abc123.supabase││
│  │               .co'                      ││
│  │ SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1Ni││
│  │                  IsInR5cCI6IkpXVCJ9...' ││
│  └─────────────────────────────────────────┘│
│                                             │
│  💾 SALVE o arquivo (Ctrl+S)                │
│                                             │
└─────────────────────────────────────────────┘
```

---

## 🟢 PASSO 5: Ativar Realtime (sincronia automática)

Para que as mudanças apareçam na hora em todos os dispositivos:

```
┌─────────────────────────────────────────────┐
│                                             │
│  No menu à esquerda, clique em:             │
│                                             │
│  ┌─────────────────────────────────────────┐│
│  │  ⚙️ Project Settings                   ││
│  └─────────────────────────────────────────┘│
│                                             │
│  Depois clique em:                          │
│  ┌─────────────────────────────────────────┐│
│  │  🔄 Realtime                            ││
│  └─────────────────────────────────────────┘│
│                                             │
│  Role a tela até "Replication"              │
│                                             │
│  Você vai ver uma lista de tabelas.         │
│  Ative (ligue) o botão destas:              │
│                                             │
│  ┌─────────────────────────────────────────┐│
│  │  ✅ reservas        (clicar no botão)   ││
│  │  ✅ pedidos         (clicar no botão)   ││
│  │  ✅ estoque         (clicar no botão)   ││
│  │  ✅ produtos        (clicar no botão)   ││
│  │  ✅ config          (clicar no botão)   ││
│  └─────────────────────────────────────────┘│
│                                             │
│  ✅ Realtime ativado!                        │
│                                             │
└─────────────────────────────────────────────┘
```

---

## 🟢 PASSO 6: Migrar dados que já existem

Se você já tem reservas, pedidos ou estoque salvos no navegador, vamos enviá-los para a nuvem agora:

```
┌─────────────────────────────────────────────┐
│                                             │
│  📁 Abra o arquivo index.html no navegador  │
│  (clicar 2x nele)                           │
│                                             │
│  ⏳ Espere carregar a tela do Arena Squad    │
│                                             │
│  Agora ABRA O CONSOLE:                      │
│                                             │
│  ┌─────────────────────────────────────────┐│
│  │  No Chrome: Pressione F12               ││
│  │  Ou clique: ⋮ > Ferramentas > Console   ││
│  └─────────────────────────────────────────┘│
│                                             │
│  Vai aparecer uma tela dividida.            │
│  Clique na aba "Console" (se não estiver).  │
│                                             │
│  No console, DIGITE e aperte ENTER:         │
│                                             │
│  ┌─────────────────────────────────────────┐│
│  │  migrar()                               ││
│  └─────────────────────────────────────────┘│
│                                             │
│  Você VAI VER mensagens verdes:             │
│  ✅ Reservas migradas                       │
│  ✅ Pedidos migrados                        │
│  ✅ Estoque migrado                         │
│  ✅ Produtos migrados                       │
│  ✅ Config migrada                          │
│                                             │
│  PRONTO! Dados na nuvem ☁️                  │
│                                             │
└─────────────────────────────────────────────┘
```

---

## 🟢 PASSO 7: Testar em outro dispositivo

```
┌─────────────────────────────────────────────┐
│                                             │
│  Agora a mágica! Pegue seu CELULAR 📱        │
│                                             │
│  Você precisa enviar o arquivo index.html   │
│  para o celular. Opções:                    │
│                                             │
│  ┌─────────────────────────────────────────┐│
│  │  ► Enviar por WhatsApp / Telegram       ││
│  │  ► Enviar por email                     ││
│  │  ► Colocar num pendrive                ││
│  │  ► Usar Google Drive / Dropbox          ││
│  │  ► Hospedar em site grátis (GitHub      ││
│  │    Pages, Netlify, Vercel)              ││
│  └─────────────────────────────────────────┘│
│                                             │
│  ⚠️ IMPORTANTE: Envie TAMBÉM o arquivo      │
│     supabase-sync.js (tem que estar na      │
│     mesma pasta do index.html)              │
│                                             │
│  Abra o index.html no celular.              │
│  Você VAI VER uma bolinha VERDE             │
│  no canto inferior esquerdo: "online"       │
│                                             │
│  As reservas que você criou no computador   │
│  vão aparecer no celular! 📱✨               │
│                                             │
│  Faça uma reserva no celular e veja         │
│  aparecer no computador em TEMPO REAL ⚡     │
│                                             │
└─────────────────────────────────────────────┘
```

---

## 🟢 PASSO EXTRA: Mudar senha do administrador

```
┌─────────────────────────────────────────────┐
│                                             │
│  Se quiser mudar a senha de admin (padrão:  │
│  99) para todos os dispositivos:            │
│                                             │
│  1. Vá no Supabase > Table Editor           │
│  2. Clique na tabela "config"               │
│  3. Clique "Insert row"                     │
│  4. Coloque:                                │
│     chave: "admin_password"                 │
│     valor: "suasenanova"                    │
│  5. Salve                                   │
│                                             │
│  Pronto! Todos os dispositivos vão usar     │
│  a nova senha automaticamente.              │
│                                             │
└─────────────────────────────────────────────┘
```

---

## ✅ RESOLUÇÃO DE PROBLEMAS

```
┌─────────────────────────────────────────────┐
│                                             │
│  ❌ PROBLEMA: Bolinha VERMELHA "offline"    │
│  ✅ SOLUÇÃO: As credenciais no arquivo      │
│     supabase-sync.js estão erradas.         │
│     Repita o PASSO 4 com cuidado.           │
│                                             │
│  ❌ PROBLEMA: Bolinha AMARELA "conectando"  │
│  ✅ SOLUÇÃO: Aguarde alguns segundos.       │
│     Se persistir, verifique sua internet.   │
│                                             │
│  ❌ PROBLEMA: "Erro ao conectar" no console │
│  ✅ SOLUÇÃO: Verifique se o SQL do          │
│     PASSO 3 foi executado corretamente.    │
│                                             │
│  ❌ PROBLEMA: Tabelas não aparecem          │
│  ✅ SOLUÇÃO: No Supabase > Table Editor,    │
│     veja se as 5 tabelas estão listadas.    │
│     Se não, repita o PASSO 3.               │
│                                             │
│  ❌ PROBLEMA: migrar() não funciona         │
│  ✅ SOLUÇÃO: Espere a bolinha ficar VERDE   │
│     antes de digitar migrar() no console.   │
│                                             │
└─────────────────────────────────────────────┘
```

---

## 📁 Arquivos que você precisa enviar

Para funcionar em outro dispositivo, você precisa copiar **TODOS** estes arquivos:

```
📁 Pro. arena/
  ├── 📄 index.html           ← OBRIGATÓRIO (a página)
  ├── 📄 supabase-sync.js     ← OBRIGATÓRIO (a sincronia)
  ├── 🖼️ Logo verde.jpeg      ← Opcional (sua logo)
  ├── 🖼️ Logo realista.jpeg   ← Opcional (sua logo)
  └── 🖼️ Logo calendario.jpeg ← Opcional (sua logo)
```

---

**🎉 Parabéns! Seu Arena Squad agora sincroniza entre todos os dispositivos!**

*Dúvidas? Me chame novamente 😊*
