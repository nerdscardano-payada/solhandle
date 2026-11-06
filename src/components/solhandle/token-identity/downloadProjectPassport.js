import html2canvas from 'html2canvas';
import QRCode from 'qrcode';

export default async function downloadProjectPassport(surface,handle) {
  await document.fonts.ready;
  const passportUrl=window.location.origin+window.location.pathname;
  const qr=await QRCode.toDataURL(passportUrl,{width:640,margin:4,errorCorrectionLevel:'M'});
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
      const section=_document.createElement('div'),code=_document.createElement('img');
      code.src=qr;code.alt='Scan to open the project passport';code.width=160;code.height=160;
      const label=_document.createElement('p');
      label.textContent='Scan to view the project passport and current ownership status';
      label.className='text-sm text-ecosystem-muted';
      const address=_document.createElement('p');
      address.textContent=passportUrl;
      address.className='text-sm text-ecosystem-muted break-all';
      section.append(code,label,address);
      clone.querySelector('.project-passport-body').appendChild(section);
      await code.decode();
    }
  });
  const blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/png'));
  if(!blob)throw new Error('The passport image could not be created. Please try again.');
  const url=URL.createObjectURL(blob),link=document.createElement('a');
  link.href=url;link.download=`solhandle-${handle}-project-passport.png`;
  document.body.appendChild(link);link.click();link.remove();
  setTimeout(()=>URL.revokeObjectURL(url),10000);
}