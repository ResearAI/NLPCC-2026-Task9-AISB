export default function SectionHeading({
  title,
  titleCn,
  subtitle,
}: {
  title: string;
  titleCn?: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-10">
      <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          className="text-3xl md:text-4xl font-bold mb-2">
        {title}
      </h1>
      {titleCn && (
        <p className="text-lg mb-2" style={{ color: 'var(--gold-400)', fontFamily: "'Noto Sans SC', sans-serif" }}>
          {titleCn}
        </p>
      )}
      {subtitle && (
        <p className="max-w-3xl leading-relaxed" style={{ color: 'var(--gray-500)' }}>
          {subtitle}
        </p>
      )}
      <div className="gold-line mt-6 max-w-xs" />
    </div>
  );
}
