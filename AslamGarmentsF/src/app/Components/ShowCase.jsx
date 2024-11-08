
import ShowCaseItem from "./ShowCaseItem"

export default function ShowCase({hot_releases, trendy, best_deal}) {

  return (
    <section className="showcase section">
      <div className="showcase__container container grid">
        <div className="showcase__wrapper">
          <h3 className="section__title">Hot Releases</h3>
          {hot_releases.map((product,index)=>(
            <ShowCaseItem item={product} key={index}/>
          ))}
        </div>
        <div className="showcase__wrapper">
          <h3 className="section__title">Trendy</h3>
          {trendy.map((product,index)=>(
            <ShowCaseItem item={product} key={index}/>
          ))}
        </div>
        <div className="showcase__wrapper">
          <h3 className="section__title">Best Deal</h3>
          {best_deal.map((product,index)=>(
            <ShowCaseItem item={product} key={index}/>
          ))}
        </div>
      </div>
    </section>
  )
}