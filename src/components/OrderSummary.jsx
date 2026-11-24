import { formatLkr, stages } from '../orders';
import { colomboToday } from '../orderWorkspace';

import { openBillingRecord } from '../billingRecord';

export default function OrderSummary({ order, showProgress = false }) {
  const { title, stage, total, paid, deposit, scope, dueDate, deliveryUrl, services, timeline, receipts } = order;
  const today = colomboToday();
  return (
    <>
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>{order.orderNumber && <p className="mb-1 text-xs font-bold tracking-wide text-nhubx-glow-primary">{order.orderNumber}</p>}<h2 className="text-xl font-bold">{title}</h2><p className="mt-1 text-sm text-gray-400">Expected delivery {dueDate}</p></div>
        <p className="rounded-full border border-white/15 px-3 py-1 text-sm">{stage}</p>
      </header>
      {showProgress && <ol aria-label="Order progress" className="mt-4 grid grid-cols-5 gap-1.5 text-xs sm:text-sm">
        {stages.map((step, index) => <li key={step} aria-current={step === stage ? 'step' : undefined} className={step === stage ? 'font-bold text-white' : 'text-gray-400'}><span aria-hidden="true" className={`mb-1.5 block h-1 rounded-full ${index <= stages.indexOf(stage) ? 'bg-nhubx-glow-primary' : 'bg-white/10'}`} />{step}</li>)}
      </ol>}
      <p className="mt-3 whitespace-pre-wrap text-sm text-gray-300">{scope}</p>
      <dl className="mt-4 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
        {[['Development total', total], ['Deposit', deposit], ['Paid', paid], ['Balance due', total - paid]].map(([label, value]) => (
          <div key={label}><dt className="text-gray-400">{label}</dt><dd className="font-semibold">{formatLkr(value)}</dd></div>
        ))}
      </dl>
      <button type="button" className="mt-3 block text-sm text-nhubx-glow-primary underline" onClick={() => openBillingRecord(order, 'development')}>View development invoice</button>
      {deliveryUrl && <a href={deliveryUrl} target="_blank" rel="noopener noreferrer" className="mt-4 inline-block text-nhubx-glow-primary underline">Open delivery</a>}
      <details className="mt-4 border-t border-white/10 pt-3" open={services.length > 0}>
        <summary className="cursor-pointer font-semibold">Annual renewals</summary>
        {services.length ? (
          <ul className="mt-2 space-y-2 text-sm">{services.map((item) => (
            <li key={item.id} className="flex flex-wrap justify-between gap-2">
              <span>{item.type} · {formatLkr(item.amount)}</span>
              <span className={item.dueDate < today ? 'text-red-300' : 'text-gray-400'}>{item.dueDate < today ? 'Overdue' : 'Due'} {item.dueDate}</span>
              <button type="button" className="text-nhubx-glow-primary underline" onClick={() => openBillingRecord(order, 'renewal', item)}>View renewal invoice</button>
            </li>
          ))}</ul>
        ) : <p className="mt-2 text-sm text-gray-400">No annual services are attached to this order.</p>}
      </details>
      <details className="mt-3 border-t border-white/10 pt-3">
        <summary className="cursor-pointer font-semibold">Order timeline and receipts</summary>
        <ol className="mt-3 space-y-2 text-sm text-gray-300">{[...timeline].reverse().map(({ at, message }, i) => <li key={at + i}><time dateTime={at}>{at.slice(0, 10)}</time> · {message}</li>)}</ol>
        <ul className="mt-3 space-y-2 text-sm text-gray-300">{receipts.map((receipt) => <li key={receipt.id}>{receipt.at.slice(0, 10)} · {receipt.label} · {formatLkr(receipt.amount)} <button type="button" className="text-nhubx-glow-primary underline" onClick={() => openBillingRecord(order, 'receipt', receipt)}>View receipt</button></li>)}</ul>
      </details>
    </>
  );
}
