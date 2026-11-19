const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
if(!reduced){
 document.body.classList.add('motion-ready');
 const reveals=new IntersectionObserver(entries=>{for(const e of entries)if(e.isIntersecting){e.target.classList.add('visible');reveals.unobserve(e.target)}},{threshold:.12});
 document.querySelectorAll('.reveal').forEach(el=>reveals.observe(el));
 const scenes=new IntersectionObserver(entries=>{for(const e of entries)e.target.classList.toggle('paused',!e.isIntersecting)});
 document.querySelectorAll('.brand-hero').forEach(el=>scenes.observe(el));
}
