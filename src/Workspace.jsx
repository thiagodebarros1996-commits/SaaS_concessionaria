import { useEffect, useMemo, useState } from 'react'
import './Workspace.css'

const storageKey = 'concessionaria-demo-data-v1'

const initialData = {
  customers: [
    { id: 1, name: 'Ana Martins', phone: '(11) 99845-2210', email: 'ana.martins@email.com' },
    { id: 2, name: 'Lucas Reis', phone: '(11) 99218-4730', email: 'lucas.reis@email.com' },
    { id: 3, name: 'Patrícia Souza', phone: '(21) 98710-6502', email: 'patricia.souza@email.com' },
  ],
  vehicles: [
    { id: 1, model: 'Corolla Hybrid', plate: 'FTR-2A81', price: 223900, status: 'Disponível' },
    { id: 2, model: 'Civic Sport', plate: 'GKL-8C32', price: 198400, status: 'Reservado' },
    { id: 3, model: 'Creta 1.0', plate: 'HMP-4D19', price: 139500, status: 'Disponível' },
    { id: 4, model: 'Onix Plus', plate: 'JQA-7E55', price: 116900, status: 'Em revisão' },
  ],
  sales: [
    { id: 1, customer: 'Ana Martins', vehicle: 'Corolla Hybrid', value: 223900, status: 'Negociação', date: '27/09/2026' },
    { id: 2, customer: 'Lucas Reis', vehicle: 'Civic Sport', value: 198400, status: 'Documentação', date: '26/09/2026' },
    { id: 3, customer: 'Patrícia Souza', vehicle: 'Creta 1.0', value: 139500, status: 'Aguardando aprovação', date: '25/09/2026' },
  ],
}

const sections = [
  { id: 'overview', label: 'Visão geral' },
  { id: 'sales', label: 'Vendas e CRM' },
  { id: 'customers', label: 'Clientes' },
  { id: 'vehicles', label: 'Estoque' },
]

const fields = {
  customers: [
    { name: 'name', label: 'Nome completo', placeholder: 'Ex.: Marina Oliveira' },
    { name: 'phone', label: 'Telefone', placeholder: '(11) 99999-9999' },
    { name: 'email', label: 'E-mail', placeholder: 'nome@email.com', type: 'email' },
  ],
  vehicles: [
    { name: 'model', label: 'Modelo', placeholder: 'Ex.: Corolla Hybrid' },
    { name: 'plate', label: 'Placa', placeholder: 'ABC-1D23' },
    { name: 'price', label: 'Preço (R$)', placeholder: '150000', type: 'number' },
    { name: 'status', label: 'Status', options: ['Disponível', 'Reservado', 'Em revisão'] },
  ],
  sales: [
    { name: 'customer', label: 'Cliente', placeholder: 'Nome do cliente' },
    { name: 'vehicle', label: 'Veículo', placeholder: 'Modelo do veículo' },
    { name: 'value', label: 'Valor (R$)', placeholder: '150000', type: 'number' },
    { name: 'status', label: 'Etapa', options: ['Novo lead', 'Negociação', 'Aguardando aprovação', 'Documentação', 'Concluída', 'Perdida'] },
  ],
}

const sectionTitles = {
  overview: 'Visão geral',
  sales: 'Vendas e CRM',
  customers: 'Clientes',
  vehicles: 'Estoque de veículos',
}

const money = (amount) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(amount || 0)

function readData() {
  try {
    const stored = localStorage.getItem(storageKey)
    return stored ? { ...initialData, ...JSON.parse(stored) } : initialData
  } catch {
    return initialData
  }
}

function Workspace({ onExit }) {
  const [data, setData] = useState(readData)
  const [section, setSection] = useState('overview')
  const [query, setQuery] = useState('')
  const [formType, setFormType] = useState('')
  const [editing, setEditing] = useState(null)
  const [formValues, setFormValues] = useState({})

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(data))
    } catch {
      // Dados continuam disponíveis durante a sessão atual.
    }
  }, [data])

  const openForm = (type, record = null) => {
    setFormType(type)
    setEditing(record)
    setFormValues(record ? { ...record } : Object.fromEntries(fields[type].map((field) => [field.name, field.options?.[0] ?? ''])))
  }

  const saveRecord = (event) => {
    event.preventDefault()
    const normalized = { ...formValues }
    if (formType === 'vehicles' || formType === 'sales') normalized.value = Number(normalized.value) || 0
    if (formType === 'vehicles') normalized.price = Number(normalized.price) || 0
    if (formType === 'sales' && !normalized.date) normalized.date = new Intl.DateTimeFormat('pt-BR').format(new Date())

    setData((current) => {
      const rows = current[formType]
      const nextRows = editing
        ? rows.map((row) => row.id === editing.id ? { ...row, ...normalized } : row)
        : [{ ...normalized, id: Date.now() }, ...rows]
      return { ...current, [formType]: nextRows }
    })
    setFormType('')
    setEditing(null)
  }

  const deleteRecord = (type, id) => {
    if (!window.confirm('Excluir este registro da demonstração?')) return
    setData((current) => ({ ...current, [type]: current[type].filter((row) => row.id !== id) }))
  }

  const filtered = useMemo(() => {
    if (!['customers', 'vehicles', 'sales'].includes(section)) return []
    const term = query.trim().toLocaleLowerCase('pt-BR')
    if (!term) return data[section]
    return data[section].filter((row) => Object.values(row).some((value) => String(value).toLocaleLowerCase('pt-BR').includes(term)))
  }, [data, query, section])

  const totalPipeline = data.sales.filter((sale) => sale.status !== 'Concluída' && sale.status !== 'Perdida').reduce((total, sale) => total + sale.value, 0)
  const availableVehicles = data.vehicles.filter((vehicle) => vehicle.status === 'Disponível').length

  const resetDemo = () => {
    if (!window.confirm('Restaurar os dados iniciais da demonstração?')) return
    setData(initialData)
    setQuery('')
  }

  const title = sectionTitles[section]
  const collectionTitle = section === 'customers' ? 'cliente' : section === 'vehicles' ? 'veículo' : 'oportunidade'

  return (
    <div className="workspace-shell">
      <aside className="workspace-sidebar">
        <button className="workspace-brand" type="button" onClick={() => setSection('overview')}>
          <span className="workspace-mark">C</span>
          <span>Concessionária<small>PAINEL DE GESTÃO</small></span>
        </button>
        <div className="workspace-branch"><span className="branch-dot" /> Loja Centro <span>⌄</span></div>
        <span className="sidebar-label">MENU PRINCIPAL</span>
        <nav className="workspace-nav" aria-label="Navegação do painel">
          {sections.map((item) => (
            <button key={item.id} type="button" className={section === item.id ? 'active' : ''} onClick={() => { setSection(item.id); setQuery('') }}>
              <span className="nav-symbol">{item.id === 'overview' ? '⌂' : item.id === 'sales' ? '↗' : item.id === 'customers' ? '◎' : '▦'}</span>
              {item.label}
              {item.id === 'sales' && <span className="nav-count">{data.sales.length}</span>}
            </button>
          ))}
        </nav>
        <div className="sidebar-footer">
          <div className="user-avatar">KS</div>
          <div className="user-info"><strong>Karina Silva</strong><span>Administradora</span></div>
          <button type="button" className="exit-button" onClick={onExit} aria-label="Voltar para a página inicial" title="Voltar para a página inicial">↗</button>
        </div>
      </aside>

      <main className="workspace-main">
        <header className="workspace-topbar">
          <div className="breadcrumb">Operação <span>/</span> <strong>{title}</strong></div>
          <div className="topbar-profile"><span className="today-label">Domingo, 27 de setembro</span><span className="profile-avatar">KS</span></div>
        </header>

        <div className="workspace-content">
          <div className="workspace-heading">
            <div><span className="workspace-eyebrow">PAINEL DA CONCESSIONÁRIA</span><h1>{section === 'overview' ? 'Bom dia, Karina' : title}</h1><p>{section === 'overview' ? 'Aqui está o resumo da sua operação hoje.' : `Acompanhe e atualize ${section === 'sales' ? 'as oportunidades comerciais' : section === 'customers' ? 'sua base de clientes' : 'os veículos da loja'}.`}</p></div>
            {section !== 'overview' && <button className="workspace-primary" type="button" onClick={() => openForm(section)}>+ Novo {collectionTitle}</button>}
          </div>

          {section === 'overview' && <>
            <div className="workspace-stats">
              <article><span>Pipeline ativo</span><strong>{money(totalPipeline)}</strong><small className="positive">{data.sales.filter((sale) => sale.status !== 'Concluída' && sale.status !== 'Perdida').length} oportunidades abertas</small><i className="stat-mark green-mark">↗</i></article>
              <article><span>Clientes cadastrados</span><strong>{data.customers.length}</strong><small>Base da loja</small><i className="stat-mark blue-mark">◎</i></article>
              <article><span>Veículos disponíveis</span><strong>{availableVehicles}</strong><small>{data.vehicles.length} no estoque total</small><i className="stat-mark orange-mark">▦</i></article>
              <article><span>Vendas concluídas</span><strong>{data.sales.filter((sale) => sale.status === 'Concluída').length}</strong><small>Registros neste painel</small><i className="stat-mark violet-mark">✓</i></article>
            </div>
            <div className="workspace-dashboard-grid">
              <section className="workspace-panel overview-sales">
                <div className="panel-title"><div><h2>Oportunidades recentes</h2><p>Negociações em andamento</p></div><button type="button" onClick={() => setSection('sales')}>Ver todas <span>→</span></button></div>
                <div className="compact-table-wrap"><table className="workspace-table"><thead><tr><th>Cliente</th><th>Veículo</th><th>Valor</th><th>Etapa</th></tr></thead><tbody>{data.sales.slice(0, 5).map((sale) => <tr key={sale.id}><td><strong>{sale.customer}</strong></td><td>{sale.vehicle}</td><td>{money(sale.value)}</td><td><span className={`deal-status ${sale.status === 'Concluída' ? 'done' : sale.status === 'Perdida' ? 'lost' : 'active-deal'}`}>{sale.status}</span></td></tr>)}</tbody></table></div>
              </section>
              <section className="workspace-panel inventory-summary">
                <div className="panel-title"><div><h2>Resumo do estoque</h2><p>Disponibilidade por veículo</p></div><button type="button" onClick={() => setSection('vehicles')}>Estoque <span>→</span></button></div>
                <div className="inventory-list">{data.vehicles.slice(0, 4).map((vehicle) => <div className="inventory-item" key={vehicle.id}><span className="car-thumb">{vehicle.model.slice(0, 1)}</span><div><strong>{vehicle.model}</strong><span>{vehicle.plate}</span></div><span className={`deal-status ${vehicle.status === 'Disponível' ? 'done' : 'active-deal'}`}>{vehicle.status}</span></div>)}</div>
              </section>
            </div>
          </>}

          {section !== 'overview' && <section className="workspace-panel records-panel">
            <div className="records-toolbar"><div><h2>{section === 'sales' ? 'Pipeline comercial' : section === 'customers' ? 'Base de clientes' : 'Veículos cadastrados'}</h2><p>{filtered.length} registro{filtered.length === 1 ? '' : 's'}</p></div><label className="search-field"><span>⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar registros" /></label></div>
            <div className="compact-table-wrap"><table className="workspace-table"><thead><tr>{section === 'customers' ? <><th>Cliente</th><th>Telefone</th><th>E-mail</th></> : section === 'vehicles' ? <><th>Veículo</th><th>Placa</th><th>Preço</th><th>Status</th></> : <><th>Cliente</th><th>Veículo</th><th>Valor</th><th>Etapa</th><th>Data</th></>}{section !== 'customers' && <th>Ações</th>}{section === 'customers' && <th>Ações</th>}</tr></thead>
              <tbody>{filtered.length === 0 && <tr><td className="empty-state" colSpan="6">Nenhum registro encontrado.</td></tr>}
                {section === 'customers' && filtered.map((row) => <tr key={row.id}><td><strong>{row.name}</strong></td><td>{row.phone}</td><td>{row.email}</td><td><RecordActions onEdit={() => openForm(section, row)} onDelete={() => deleteRecord(section, row.id)} /></td></tr>)}
                {section === 'vehicles' && filtered.map((row) => <tr key={row.id}><td><strong>{row.model}</strong></td><td>{row.plate}</td><td>{money(row.price)}</td><td><span className={`deal-status ${row.status === 'Disponível' ? 'done' : 'active-deal'}`}>{row.status}</span></td><td><RecordActions onEdit={() => openForm(section, row)} onDelete={() => deleteRecord(section, row.id)} /></td></tr>)}
                {section === 'sales' && filtered.map((row) => <tr key={row.id}><td><strong>{row.customer}</strong></td><td>{row.vehicle}</td><td>{money(row.value)}</td><td><select className="status-select" aria-label={`Etapa de ${row.customer}`} value={row.status} onChange={(event) => setData((current) => ({ ...current, sales: current.sales.map((sale) => sale.id === row.id ? { ...sale, status: event.target.value } : sale) }))}>{fields.sales.find((field) => field.name === 'status').options.map((option) => <option key={option}>{option}</option>)}</select></td><td>{row.date}</td><td><RecordActions onEdit={() => openForm(section, row)} onDelete={() => deleteRecord(section, row.id)} /></td></tr>)}
              </tbody></table></div>
          </section>}

          <footer className="workspace-note"><span>AMBIENTE DE DEMONSTRAÇÃO</span><p>Os registros ficam salvos neste navegador. Ainda não há sincronização entre dispositivos ou contas.</p><button type="button" onClick={resetDemo}>Restaurar dados de exemplo</button></footer>
        </div>
      </main>

      {formType && <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setFormType('') }}><section className="record-modal" role="dialog" aria-modal="true" aria-labelledby="record-modal-title"><div className="modal-heading"><div><span className="workspace-eyebrow">CADASTRO</span><h2 id="record-modal-title">{editing ? 'Editar' : 'Novo'} {collectionTitle}</h2></div><button type="button" className="modal-close" onClick={() => setFormType('')} aria-label="Fechar">×</button></div><form onSubmit={saveRecord}>{fields[formType].map((field) => <label className="form-field" key={field.name}>{field.label}{field.options ? <select value={formValues[field.name] ?? field.options[0]} onChange={(event) => setFormValues((current) => ({ ...current, [field.name]: event.target.value }))}>{field.options.map((option) => <option key={option}>{option}</option>)}</select> : <input required type={field.type || 'text'} min={field.type === 'number' ? '0' : undefined} value={formValues[field.name] ?? ''} placeholder={field.placeholder} onChange={(event) => setFormValues((current) => ({ ...current, [field.name]: event.target.value }))} />}</label>)}<div className="modal-actions"><button type="button" className="workspace-quiet" onClick={() => setFormType('')}>Cancelar</button><button type="submit" className="workspace-primary">Salvar {collectionTitle}</button></div></form></section></div>}
    </div>
  )
}

function RecordActions({ onEdit, onDelete }) {
  return <div className="record-actions"><button type="button" onClick={onEdit}>Editar</button><button type="button" onClick={onDelete} aria-label="Excluir registro">Excluir</button></div>
}

export default Workspace
