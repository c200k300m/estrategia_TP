-- Schema da ferramenta de estratégias Komplexa.
-- Rodar no SQL Editor do Supabase (uma vez).

create table public.estrategias (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  cliente text not null,
  md_source text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.estrategia_versoes (
  id uuid primary key default gen_random_uuid(),
  estrategia_id uuid not null references public.estrategias (id) on delete cascade,
  md_source text not null,
  criada_em timestamptz not null default now()
);

alter table public.estrategias enable row level security;
alter table public.estrategia_versoes enable row level security;

-- Sem policy de select para anon: anônimo NÃO lê a tabela (nem lista).
-- Admin autenticado tem acesso total.
create policy "admin_estrategias" on public.estrategias
  for all to authenticated using (true) with check (true);
create policy "admin_versoes" on public.estrategia_versoes
  for all to authenticated using (true) with check (true);

-- Única leitura pública: busca por slug exato, no máximo 1 registro.
create or replace function public.get_estrategia (p_slug text)
returns table (cliente text, md_source text, updated_at timestamptz)
language sql
security definer
set search_path = public
stable
as $$
  select cliente, md_source, updated_at
  from public.estrategias
  where slug = p_slug
  limit 1;
$$;

revoke execute on function public.get_estrategia (text) from public;
grant execute on function public.get_estrategia (text) to anon, authenticated;

-- Republicar arquiva a versão anterior automaticamente.
create or replace function public.arquivar_versao ()
returns trigger
language plpgsql
as $$
begin
  if new.md_source is distinct from old.md_source then
    insert into public.estrategia_versoes (estrategia_id, md_source)
    values (old.id, old.md_source);
  end if;
  new.updated_at = now();
  return new;
end;
$$;

create trigger trg_arquivar_versao
  before update on public.estrategias
  for each row execute function public.arquivar_versao ();
