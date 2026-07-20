import decorationsHtml from './heroDecorations.html?raw';

export function HeroDecorations() {
  return <div dangerouslySetInnerHTML={{ __html: decorationsHtml }} />;
}
