import './App.css'
import { useMemo, useState } from 'react'
import Workspace from './Workspace'

const metrics = [
  { value: '3.4k', label: 'veículos monitorados' },
  { value: '98%', label: 'satisfação dos clientes' },
  { value: '24h', label: 'para ativar o sistema' },
]

const features = [
  {
    title: 'Gestão de frota',
    text: 'Controle de veículos, custos, manutenção e disponibilidade em um único painel.',
  },
  {
    title: 'Vendas e CRM',
    text: 'Acompanhe propostas, leads, comissões e funil de vendas com visibilidade real.',
  },
  {
    title: 'Financeiro',
    text: 'Automatize recebimentos, parcelas, contas e relatórios de rentabilidade por loja.',
  },
  {
    title: 'Operações',
    text: 'Padronize processos internos, checklist e indicadores de performance do negócio.',
  },
]

const plans = [
  {
    name: 'Essentials',
    price: 'R$ 499',
    note: 'por mês',
    features: ['Dashboard executivo', 'CRM básico', 'Vendas e estoque', 'Suporte por e-mail'],
    featured: false,
  },
  {
    name: 'Pro',
    price: 'R$ 999',
    note: 'por mês',
    features: ['Tudo do Essentials', 'Financeiro integrado', 'Alertas automáticos', 'Consultoria mensal'],
    featured: true,
  },
  {
    name: 'Enterprise',
    price: 'Sob consulta',
    note: 'personalizado',
    features: ['Customizações avançadas', 'Multi-loja', 'SLA dedicado', 'Equipe especializada'],
    featured: false,
  },
]

const dashboardCards = [
  { label: 'Faturamento', value: 'R$ 184,7k', trend: '+12,4%', tone: 'green' },
  { label: 'Vendas no dia', value: '128', trend: '+18,2%', tone: 'blue' },
  { label: 'Estoque crítico', value: '14', trend: '-6,1%', tone: 'amber' },
]

const activity = [
  { name: 'Leads quentes', value: '42', detail: '12 novos hoje' },
  { name: 'Propostas em análise', value: '19', detail: '3 vencem hoje' },
  { name: 'Vendas fechadas', value: '87', detail: 'taxa de 34%' },
]

const stockTable = [
  { model: 'Corolla Hybrid', stock: '18', status: 'Disponível' },
  { model: 'Civic Sport', stock: '7', status: 'Baixo' },
  { model: 'Creta 1.0', stock: '24', status: 'Disponível' },
  { model: 'Onix Plus', stock: '11', status: 'Em revisão' },
]

const testimonials = [
  { name: 'Marcos Silva', role: 'Diretor, AutoPrime', text: 'A operação ficou muito mais previsível. Vendas e manutenção passaram a falar a mesma língua.' },
  { name: 'Fernanda Costa', role: 'Gestora, Velocidade Motors', text: 'Em 3 semanas já percebemos ganho real em velocidade de aprovação e controle de estoque.' },
  { name: 'Rafael Nunes', role: 'Sócio, Norte Auto', text: 'O painel dá clareza imediata para tomar decisões sem depender de planilhas e reuniões improvisadas.' },
]

const steps = [
  'Importe clientes, veículos e contratos em minutos',
  'Automatize propostas, prazos e acompanhamento de leads',
  'Monitore desempenho por loja, vendedor e modelo',
]

const salesRows = [
  { customer: 'Ana Martins', vehicle: 'Corolla Hybrid', value: 'R$ 223.900', stage: 'Negociação', date: 'Hoje' },
  { customer: 'Lucas Reis', vehicle: 'Civic Sport', value: 'R$ 198.400', stage: 'Documentação', date: 'Hoje' },
  { customer: 'Patrícia Souza', vehicle: 'Creta 1.0', value: 'R$ 139.500', stage: 'Aguardando aprovação', date: 'Ontem' },
  { customer: 'Mateus Lima', vehicle: 'Onix Plus', value: 'R$ 116.900', stage: 'Orçamento', date: 'Ontem' },
]

const operations = [
  { label: 'Loja Centro', score: '92%', detail: 'Vendas 14% acima da meta' },
  { label: 'Loja Norte', score: '84%', detail: 'Estoque em normalidade' },
  { label: 'Loja Sul', score: '76%', detail: 'Atenção em aprovação' },
]

function App() {
  const [showWorkspace, setShowWorkspace] = useState(false)
  const [vehiclePrice, setVehiclePrice] = useState(145000)
  const [downPayment, setDownPayment] = useState(30000)
  const [months, setMonths] = useState(48)
  const [rate, setRate] = useState(1.79)

  const financing = useMemo(() => {
    const financed = Math.max(vehiclePrice - downPayment, 0)
    const monthlyRate = rate / 100 / 12

    const installment = financed > 0 && monthlyRate > 0
      ? (financed * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -months))
      : 0

    return {
      financed,
      installment,
      total: installment * months + downPayment,
    }
  }, [vehiclePrice, downPayment, months, rate])

  if (showWorkspace) {
    return <Workspace onExit={() => setShowWorkspace(false)} />
  }

  return (
    <div className="page-shell">
      <header className="topbar">
        <div className="brand">
          <span className="brand-mark">C</span>
          <span>Concessionária SaaS</span>
        </div>

        <nav className="nav">
          <a href="#solucoes">Soluções</a>
          <a href="#painel">Painel</a>
          <a href="#simulador">Simulador</a>
          <a href="#precos">Preços</a>
          <a href="#contato">Contato</a>
        </nav>

        <div className="topbar-actions">
          <button type="button" className="btn btn-secondary" onClick={() => setShowWorkspace(true)}>Entrar</button>
          <button type="button" className="btn btn-primary" onClick={() => setShowWorkspace(true)}>Agendar demo</button>
        </div>
      </header>

      <main className="landing">
        <section className="hero" id="beneficios">
          <div className="hero-copy">
            <span className="eyebrow">Software para concessionárias</span>
            <h1>Transforme sua concessionária em uma operação inteligente.</h1>
            <p>
              Centralize vendas, estoque, financeiro e desempenho em uma plataforma
              projetada para acelerar decisões, reduzir desperdícios e aumentar a conversão.
            </p>

            <div className="hero-actions">
              <button type="button" className="btn btn-primary large">Solicitar demonstração</button>
              <button type="button" className="btn btn-secondary large">Ver planos</button>
            </div>

            <ul className="proof-list">
              <li>+42% em produtividade</li>
              <li>+18% em conversão</li>
              <li>Sem planilhas manuais</li>
            </ul>
          </div>

          <div className="hero-panel">
            <div className="panel-card main-card">
              <div className="card-header">
                <span className="dot green" />
                <span>Resumo da operação</span>
              </div>

              <div className="card-balance">
                <small>Receita do mês</small>
                <strong>R$ 184.760</strong>
              </div>

              <div className="mini-chart">
                <span style={{ height: '38%' }} />
                <span style={{ height: '52%' }} />
                <span style={{ height: '64%' }} />
                <span style={{ height: '58%' }} />
                <span style={{ height: '82%' }} />
                <span style={{ height: '100%' }} />
              </div>

              <div className="kpis">
                <div>
                  <label>Vendas</label>
                  <strong>128</strong>
                </div>
                <div>
                  <label>Estoque</label>
                  <strong>96%</strong>
                </div>
              </div>
            </div>

            <div className="panel-card floating-card">
              <small>Meta do mês</small>
              <strong>R$ 220k</strong>
              <span>+12% em relação ao mês anterior</span>
            </div>
          </div>
        </section>

        <section className="metrics" aria-label="Indicadores principais">
          {metrics.map((item) => (
            <div key={item.label} className="metric-item">
              <strong>{item.value}</strong>
              <span>{item.label}</span>
            </div>
          ))}
        </section>

        <section className="features" id="solucoes">
          <div className="section-heading">
            <span className="eyebrow">Tudo em um lugar</span>
            <h2>Ferramentas pensadas para o dia a dia do seu negócio</h2>
          </div>

          <div className="feature-grid">
            {features.map((feature) => (
              <article key={feature.title} className="feature-card">
                <span className="feature-icon">✓</span>
                <h3>{feature.title}</h3>
                <p>{feature.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="dashboard-preview" id="painel">
          <div className="section-heading">
            <span className="eyebrow">Painel operacional</span>
            <h2>Visão completa da operação em tempo real</h2>
          </div>

          <div className="dashboard-layout">
            <div className="overview-panel">
              <div className="dashboard-grid">
                {dashboardCards.map((card) => (
                  <div key={card.label} className={`summary-card ${card.tone}`}>
                    <span>{card.label}</span>
                    <strong>{card.value}</strong>
                    <small>{card.trend}</small>
                  </div>
                ))}
              </div>

              <div className="sales-panel">
                <div className="sales-header">
                  <h3>Performance de vendas</h3>
                  <span>Últimos 7 dias</span>
                </div>

                <div className="bar-chart" aria-label="Gráfico de vendas">
                  <span style={{ height: '35%' }} />
                  <span style={{ height: '45%' }} />
                  <span style={{ height: '52%' }} />
                  <span style={{ height: '68%' }} />
                  <span style={{ height: '62%' }} />
                  <span style={{ height: '78%' }} />
                  <span style={{ height: '92%' }} />
                </div>
              </div>
            </div>

            <aside className="insights-panel">
              <h3>Resumo do dia</h3>

              {activity.map((item) => (
                <div key={item.name} className="insight-item">
                  <div>
                    <strong>{item.value}</strong>
                    <span>{item.name}</span>
                  </div>
                  <small>{item.detail}</small>
                </div>
              ))}
            </aside>
          </div>

          <div className="dashboard-bottom-grid">
            <div className="stock-table-wrap">
              <div className="table-header">
                <h3>Estoque por modelo</h3>
                <button type="button" className="btn btn-secondary">Exportar</button>
              </div>

              <table className="stock-table">
                <thead>
                  <tr>
                    <th>Veículo</th>
                    <th>Disponível</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {stockTable.map((item) => (
                    <tr key={item.model}>
                      <td>{item.model}</td>
                      <td>{item.stock}</td>
                      <td>
                        <span className={`status ${item.status === 'Baixo' ? 'warning' : item.status === 'Em revisão' ? 'neutral' : 'good'}`}>
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="pipeline-panel">
              <div className="table-header">
                <h3>Pipeline de vendas</h3>
                <span>Hoje</span>
              </div>

              <div className="pipeline-list">
                {salesRows.map((row) => (
                  <div key={`${row.customer}-${row.vehicle}`} className="pipeline-row">
                    <div>
                      <strong>{row.customer}</strong>
                      <span>{row.vehicle}</span>
                    </div>
                    <div>
                      <strong>{row.value}</strong>
                      <span>{row.stage}</span>
                    </div>
                    <small>{row.date}</small>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="simulator" id="simulador">
          <div className="section-heading">
            <span className="eyebrow">Simulador</span>
            <h2>Calcule a parcela ideal do seu veículo</h2>
          </div>

          <div className="simulator-grid">
            <div className="simulator-card input-card">
              <label>
                Valor do veículo
                <input type="number" value={vehiclePrice} onChange={(event) => setVehiclePrice(Number(event.target.value) || 0)} />
              </label>

              <label>
                Entrada
                <input type="number" value={downPayment} onChange={(event) => setDownPayment(Number(event.target.value) || 0)} />
              </label>

              <label>
                Parcelas
                <input type="range" min="12" max="84" step="12" value={months} onChange={(event) => setMonths(Number(event.target.value))} />
                <div className="range-meta">
                  <span>12 meses</span>
                  <strong>{months} meses</strong>
                  <span>84 meses</span>
                </div>
              </label>

              <label>
                Taxa mensal
                <input type="number" value={rate} step="0.1" onChange={(event) => setRate(Number(event.target.value) || 0)} />
              </label>
            </div>

            <div className="simulator-card result-card">
              <div className="result-header">
                <span>Resumo do financiamento</span>
                <strong>{months}x</strong>
              </div>

              <div className="finance-row">
                <span>Valor financiado</span>
                <strong>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(financing.financed)}</strong>
              </div>

              <div className="finance-row highlight">
                <span>Parcela estimada</span>
                <strong>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(financing.installment)}</strong>
              </div>

              <div className="finance-row">
                <span>Total com entrada</span>
                <strong>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(financing.total)}</strong>
              </div>

              <div className="simulator-steps">
                {steps.map((step) => (
                  <div key={step} className="step-item">
                    <span>•</span>
                    <p>{step}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="operations-section">
          <div className="section-heading">
            <span className="eyebrow">Desempenho</span>
            <h2>Operação distribuída pelas lojas</h2>
          </div>

          <div className="operations-grid">
            {operations.map((item) => (
              <article key={item.label} className="operation-card">
                <div className="operation-head">
                  <span>{item.label}</span>
                  <strong>{item.score}</strong>
                </div>
                <p>{item.detail}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="testimonials">
          <div className="section-heading center">
            <span className="eyebrow">Casos reais</span>
            <h2>Quem já usa a plataforma vê resultado rápido</h2>
          </div>

          <div className="testimonial-grid">
            {testimonials.map((testimonial) => (
              <article key={testimonial.name} className="testimonial-card">
                <div className="quote-mark">“</div>
                <p>{testimonial.text}</p>
                <div className="testimonial-author">
                  <strong>{testimonial.name}</strong>
                  <span>{testimonial.role}</span>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="pricing" id="precos">
          <div className="section-heading center">
            <span className="eyebrow">Planos</span>
            <h2>Escolha o nível ideal para sua operação</h2>
          </div>

          <div className="pricing-grid">
            {plans.map((plan) => (
              <article key={plan.name} className={`price-card ${plan.featured ? 'featured' : ''}`}>
                <h3>{plan.name}</h3>
                <div className="price-row">
                  <strong>{plan.price}</strong>
                  <span>{plan.note}</span>
                </div>
                <ul>
                  {plan.features.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <button type="button" className={`btn ${plan.featured ? 'btn-primary' : 'btn-secondary'}`}>
                  {plan.featured ? 'Mais escolhido' : 'Assinar'}
                </button>
              </article>
            ))}
          </div>
        </section>

        <section className="cta-banner" id="contato">
          <div>
            <span className="eyebrow">Pronto para evoluir?</span>
            <h2>Modernize sua concessionária com tecnologia que escala.</h2>
          </div>
          <button type="button" className="btn btn-primary large">Falar com especialista</button>
        </section>
      </main>
    </div>
  )
}

export default App
