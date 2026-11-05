import { getPassport } from './passportRegistrationStore.ts';
export async function passportPublicAuthority(db,binding) {
  if(!binding)return {binding:null,version:'none'};
  let item;
  try {item=await getPassport(db,binding.association_id);}catch(error){if(error.status!==404)throw error;}
  const active=item?.public_active&&item.status==='approved'&&item.public_consent&&item.wallet===binding.wallet&&item.mint===binding.mint&&item.handle===binding.handle&&item.asset===binding.asset;
  // This deliberately public lookup reads only the registration referenced by
  // an already-public projection. It never returns private registration fields.
  return {binding:active?binding:{...binding,status:'WITHDRAWN'},version:item?`${item.version}:${item.status}:${!!item.public_active}`:'missing'};
}