-- ============================================================
-- ARENA SQUAD - Setup Completo (Tabelas + RLS + Realtime)
-- Execute no SQL Editor do Supabase (Ctrl+A, Run)
-- ============================================================

-- 1. Tabela de Reservas (horários do calendário)
CREATE TABLE IF NOT EXISTS reservas (
  slot_key TEXT PRIMARY KEY,
  nome TEXT NOT NULL DEFAULT '',
  tel TEXT NOT NULL DEFAULT '',
  date TEXT NOT NULL DEFAULT '',
  time TEXT NOT NULL DEFAULT '',
  estilo TEXT NOT NULL DEFAULT '',
  tipo TEXT NOT NULL DEFAULT '',
  num_jog INTEGER NOT NULL DEFAULT 0,
  senha TEXT NOT NULL DEFAULT '',
  vagas JSONB NOT NULL DEFAULT '[]',
  pago BOOLEAN NOT NULL DEFAULT false,
  timestamp BIGINT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reservas_date ON reservas (date);

-- 2. Tabela de Pedidos da Loja
CREATE TABLE IF NOT EXISTS pedidos (
  id TEXT PRIMARY KEY,
  cliente TEXT NOT NULL DEFAULT '',
  telefone TEXT NOT NULL DEFAULT '',
  data_retirada TEXT NOT NULL DEFAULT '',
  data_pedido TEXT NOT NULL DEFAULT '',
  itens JSONB NOT NULL DEFAULT '[]',
  total NUMERIC(10,2) NOT NULL DEFAULT 0,
  obs TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_pedidos_data ON pedidos (data_retirada);

-- 3. Tabela de Estoque
CREATE TABLE IF NOT EXISTS estoque (
  id TEXT PRIMARY KEY,
  quantidade INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Tabela de Produtos
CREATE TABLE IF NOT EXISTS produtos (
  id TEXT PRIMARY KEY,
  cat TEXT NOT NULL DEFAULT 'outros',
  nome TEXT NOT NULL DEFAULT '',
  descricao TEXT NOT NULL DEFAULT '',
  desc_curta TEXT NOT NULL DEFAULT '',
  desc_longa TEXT NOT NULL DEFAULT '',
  preco NUMERIC(10,2) NOT NULL DEFAULT 0,
  ico TEXT NOT NULL DEFAULT '◆',
  badge TEXT,
  est INTEGER NOT NULL DEFAULT 0,
  imagem TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Tabela de Configurações
CREATE TABLE IF NOT EXISTS config (
  chave TEXT PRIMARY KEY,
  valor TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Inserir configuração padrão PIX
INSERT INTO config (chave, valor)
VALUES ('pix', '00.000.000/0001-00')
ON CONFLICT (chave) DO NOTHING;

-- 6. TRIGGERS: updated_at automático
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_reservas_updated_at ON reservas;
CREATE TRIGGER trg_reservas_updated_at BEFORE UPDATE ON reservas
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS trg_estoque_updated_at ON estoque;
CREATE TRIGGER trg_estoque_updated_at BEFORE UPDATE ON estoque
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS trg_produtos_updated_at ON produtos;
CREATE TRIGGER trg_produtos_updated_at BEFORE UPDATE ON produtos
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS trg_config_updated_at ON config;
CREATE TRIGGER trg_config_updated_at BEFORE UPDATE ON config
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- RLS: Permite que a chave anon (pública) acesse TUDO
-- Isso é seguro para este caso pois os dados não são sensíveis
-- ============================================================

-- RESERVAS
ALTER TABLE reservas ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_all" ON reservas;
CREATE POLICY "anon_all" ON reservas
  FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);

-- PEDIDOS
ALTER TABLE pedidos ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_all" ON pedidos;
CREATE POLICY "anon_all" ON pedidos
  FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);

-- ESTOQUE
ALTER TABLE estoque ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_all" ON estoque;
CREATE POLICY "anon_all" ON estoque
  FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);

-- PRODUTOS
ALTER TABLE produtos ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_all" ON produtos;
CREATE POLICY "anon_all" ON produtos
  FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);

-- CONFIG
ALTER TABLE config ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_all" ON config;
CREATE POLICY "anon_all" ON config
  FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);

-- ============================================================
-- REALTIME: Ativar publicação para sincronia entre dispositivos
-- ============================================================

-- DROP PUBLICATION IF EXISTS supabase_realtime;
-- CREATE PUBLICATION supabase_realtime;

ALTER PUBLICATION supabase_realtime ADD TABLE IF NOT EXISTS reservas;
ALTER PUBLICATION supabase_realtime ADD TABLE IF NOT EXISTS pedidos;
ALTER PUBLICATION supabase_realtime ADD TABLE IF NOT EXISTS estoque;
ALTER PUBLICATION supabase_realtime ADD TABLE IF NOT EXISTS produtos;
ALTER PUBLICATION supabase_realtime ADD TABLE IF NOT EXISTS config;

-- ============================================================
-- VERIFICAÇÃO: Mostrar as tabelas criadas
-- ============================================================
SELECT table_name, table_type
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;
