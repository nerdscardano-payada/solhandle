import html2canvas from 'html2canvas';

export default async function downloadProjectPassport(surface,handle) {
  await document.fonts.ready;
  const images=await Promise.all(Array.from(surface.querySelectorAll('img')).map(async image=>{
    const source=image.currentSrc||image.src;
    const response=await fetch(source,{signal:AbortSignal.timeout(15000)});
    if(!response.ok)throw new Error('A passport image could not be loaded. Please try again.');
    const blob=await response.blob();
    return new Promise((resolve,reject)=>{
      const reader=new FileReader();
      reader.onload=()=>resolve(reader.result);
      reader.onerror=()=>reject(new Error('A passport image could not be prepared.'));
      reader.readAsDataURL(blob);
    });
  }));
  const canvas=await html2canvas(surface,{
    scale:2,backgroundColor:null,useCORS:true,logging:false,
    onclone:async(_document,clone)=>{
      clone.querySelectorAll('.project-passport-actions').forEach(element=>element.remove());
      await Promise.all(Array.from(clone.querySelectorAll('img')).map(async(image,index)=>{
        image.removeAttribute('srcset');image.removeAttribute('sizes');image.loading='eager';image.src=images[index];
        await image.decode();
      }));
      const address=_document.createElement('p');
      address.textContent=window.location.origin+window.location.pathname;
      address.className='text-sm text-ecosystem-muted break-all';
      clone.querySelector('.project-passport-body').appendChild(address);
    }
  });
  const blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/png'));
  if(!blob)throw new Error('The passport image could not be created. Please try again.');
  const url=URL.createObjectURL(blob),link=document.createElement('a');
  link.href=url;link.download=`solhandle-${handle}-project-passport.png`;
  document.body.appendChild(link);link.click();link.remove();
  setTimeout(()=>URL.revokeObjectURL(url),10000);
}