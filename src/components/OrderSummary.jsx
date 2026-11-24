import { formatLkr } from '../orders';

function downloadRecord(reference, lines) {
  const file = new Blob([['NHubX', reference, ...lines].join('\n')], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(file);
  const link = document.createElement('a');
  link.href = url;
  link.download = reference + '.txt';
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export default function OrderSummary({ order }) {
  const { title, stage, total, paid, deposit, scope, dueDate, deliveryUrl, services, timeline, receipts } = order;
  const today = new Intl.DateTimeFormat('sv-SE', { timeZone: 'Asia/Colombo' }).format(new Date());
  return (
    <>
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div><h2 className="text-xl font-bold">{title}</h2><p className="mt-1 text-sm text-gray-400">Expected delivery {dueDate}</p></div>
        <p className="rounded-full border border-white/15 px-3 py-1 text-sm">{stage}</p>
      </header>
      <p className="mt-3 whitespace-pre-wrap text-sm text-gray-300">{scope}</p>
      <dl className="mt-4 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
        {[['Development total', total], ['Deposit', deposit], ['Paid', paid], ['Balance due', total - paid]].map(([label, value]) => (
          <div key={label}><dt className="text-gray-400">{label}</dt><dd className="font-semibold">{formatLkr(value)}</dd></div>
        ))}
      </dl>
      <button type="button" className="mt-3 block text-sm text-nhubx-glow-primary underline" onClick={() => downloadRecord('Invoice-' + order.id, [title, scope, 'Development total: ' + formatLkr(total), 'Deposit: ' + formatLkr(deposit), 'Paid: ' + formatLkr(paid), 'Balance due: ' + formatLkr(total - paid)])}>Download development invoice</button>
      {deliveryUrl && <a href={deliveryUrl} target="_blank" rel="noopener noreferrer" className="mt-4 inline-block text-nhubx-glow-primary underline">Open delivery</a>}
      <details className="mt-4 border-t border-white/10 pt-3" open={services.length > 0}>
        <summary className="cursor-pointer font-semibold">Annual renewals</summary>
        {services.length ? (
          <ul className="mt-2 space-y-2 text-sm">{services.map((item) => (
            <li key={item.id} className="flex flex-wrap justify-between gap-2">
              <span>{item.type} · {formatLkr(item.amount)}</span>
              <span className={item.dueDate < today ? 'text-red-300' : 'text-gray-400'}>{item.dueDate < today ? 'Overdue' : 'Due'} {item.dueDate}</span>
              <button type="button" className="text-nhubx-glow-primary underline" onClick={() => downloadRecord('Renewal-' + item.id + '-' + item.dueDate, [title, item.type, 'Due: ' + item.dueDate, 'Amount due: ' + formatLkr(item.amount)])}>Download invoice</button>
            </li>
          ))}</ul>
        ) : <p className="mt-2 text-sm text-gray-400">No annual services are attached to this order.</p>}
      </details>
      <details className="mt-3 border-t border-white/10 pt-3">
        <summary className="cursor-pointer font-semibold">Order timeline and receipts</summary>
        <ol className="mt-3 space-y-2 text-sm text-gray-300">{[...timeline].reverse().map(({ at, message }, i) => <li key={at + i}><time dateTime={at}>{at.slice(0, 10)}</time> · {message}</li>)}</ol>
        <ul className="mt-3 space-y-2 text-sm text-gray-300">{receipts.map((receipt) => <li key={receipt.id}>{receipt.at.slice(0, 10)} · {receipt.label} · {formatLkr(receipt.amount)} <button type="button" className="text-nhubx-glow-primary underline" onClick={() => downloadRecord('Receipt-' + receipt.id, [title, receipt.label, receipt.at.slice(0, 10), 'Received: ' + formatLkr(receipt.amount)])}>Download receipt</button></li>)}</ul>
      </details>
    </>
  );
}
