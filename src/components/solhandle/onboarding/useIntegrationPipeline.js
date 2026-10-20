import { useCallback, useEffect, useState } from 'react';
import { intakeCall, intakeError } from '@/components/solhandle/onboarding/intakeClient';
export default function useIntegrationPipeline() {
  const [filters,setFilters] = useState({type:'project',status:'',category:'',network:'',since:'',priority:''}), [page,setPage] = useState(null), [detail,setDetail] = useState(null), [busy,setBusy] = useState(false), [error,setError] = useState('');
  const load = useCallback(async cursor => {setBusy(true);setError('');try {const data = await intakeCall({action:'list',...filters,cursor},true);setPage(previous => cursor ? {...data,items:[...previous.items,...data.items]} : data);} catch(e) {setError(intakeError(e));} finally {setBusy(false);}},[filters]);
  useEffect(() => {setPage(null);setDetail(null);load();},[load]);
  async function open(record) {setBusy(true);setError('');try {setDetail(await intakeCall({action:'detail',id:record.id,type:filters.type},true));} catch(e) {setError(intakeError(e));} finally {setBusy(false);} }
  async function save(changes) {setBusy(true);setError('');try {setDetail(await intakeCall({action:'update',id:detail.record.id,type:filters.type,...changes},true));await load();} catch(e) {setError(intakeError(e));} finally {setBusy(false);} }
  return {filters,setFilters,page,detail,setDetail,busy,error,load,open,save};
}