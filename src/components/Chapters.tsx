import { site } from "@/content";
import { Photo } from "./Photo";

/**
 * "An evening on the Sunset Cruise": the section holds on screen while each photograph
 * wipes up over the last and the caption panel changes. Motion.tsx drives it; without
 * motion it is a plain list of photographs with their text.
 */
export function Chapters() {
  const { title, items } = site.chapters;
  return (
    <section
      id="evening"
      className="chapters"
      aria-labelledby="chapters-title"
      data-chapters
      data-port="The evening"
      style={{ "--n": items.length } as React.CSSProperties}
    >
      <div className="chapters__stage">
        <div className="wrap chapters__head">
          <h2 id="chapters-title" className="h2" data-split>
            {title}
          </h2>
          <ol className="chapters__dots" aria-hidden="true">
            {items.map((item, i) => (
              <li key={item.time}>
                <span className="chapters__dot" data-first={i === 0 || undefined} />
              </li>
            ))}
          </ol>
        </div>
        <div className="wrap chapters__body">
          <ol className="chapters__list">
            {items.map((item, i) => (
              <li key={item.time} className="chapters__item">
                <div className="chapters__frame" data-first={i === 0 || undefined}>
                  <Photo {...item.photo} aspect="16:9" sizes="(min-width: 1024px) 1240px, 100vw" />
                </div>
                <div className="chapters__panel" data-first={i === 0 || undefined}>
                  <p className="chapters__time">
                    <span className="chapters__num">{String(i + 1).padStart(2, "0")}</span> {item.time}
                  </p>
                  <h3 className="h3">{item.title}</h3>
                  <p>{item.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
