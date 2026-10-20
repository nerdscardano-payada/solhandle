import { useEffect, useState } from 'react';
import { intakeCall, trackIntake, intakeError } from '@/components/solhandle/onboarding/intakeClient';
const empty = {product_types:[],use_cases:[],tech_stack:[],integration_preference:[]};
export default function useIntegrationIntake() {
  const [config,setConfig] = useState(null), [type,setType] = useState(''), [step,setStep] = useState(0), [values,setValues] = useState(empty), [result,setResult] = useState(null);
  const [token,setToken] = useState(''), [receiptToken,setReceiptToken] = useState(''), [busy,setBusy] = useState(false), [error,setError] = useState(''), [resetKey,setResetKey] = useState(0);
  async function load() { setError(''); try {setConfig(await intakeCall({action:'config'}));} catch(e) {setError(intakeError(e));} }
  useEffect(() => { trackIntake('integrate_page_view'); load(); const selectedFlow = new URLSearchParams(window.location.search).get('flow'); if (['project','nomination'].includes(selectedFlow)) start(selectedFlow); },[]);
  useEffect(() => { if (result) trackIntake('recommendation_viewed',{flow:result.type}); },[result?.reference]);
  function start(flow) { setType(flow);setStep(0);setValues(empty);setResult(null);setToken('');setReceiptToken(crypto.randomUUID());setError('');trackIntake('integration_start',{flow}); }
  function change(name,value) { setValues(previous => ({...previous,[name]:value}));setError('');if (name === 'product_types' || name === 'use_cases') trackIntake(name === 'product_types' ? 'project_type_selected' : 'use_case_selected',{selected_count:value.length}); }
  async function submit() {
    if (busy) return; setBusy(true);setError('');
    try {
      const source = new URLSearchParams(window.location.search).get('source') || 'direct';
      const saved = await intakeCall({...values,action:'submit',type,receipt_token:receiptToken,turnstile_token:token,source});
      setResult(saved); sessionStorage.setItem('solhandle-integration-receipt',JSON.stringify({receiptToken,type}));trackIntake(type === 'project' ? 'integration_submitted' : 'community_project_suggested',{flow:type});
    } catch(e) {setError(intakeError(e));setToken('');setResetKey(key => key+1);} finally {setBusy(false);}
  }
  async function restore() {
    const saved = sessionStorage.getItem('solhandle-integration-receipt'); if (!saved) return;
    setBusy(true);setError('');try {const entry = JSON.parse(saved);setResult(await intakeCall({action:'receipt',receipt_token:entry.receiptToken,type:entry.type}));setReceiptToken(entry.receiptToken);setType(entry.type);} catch(e) {setError(intakeError(e));} finally {setBusy(false);}
  }
  async function review() {setBusy(true);setError('');try {setResult(await intakeCall({action:'request_review',receipt_token:receiptToken,type}));trackIntake('technical_review_requested');} catch(e) {setError(intakeError(e));} finally {setBusy(false);} }
  return {config,type,step,setStep,values,change,result,start,submit,review,restore,load,token,setToken,busy,error,setError,resetKey};
}