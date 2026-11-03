import { useEffect, useState } from 'react';
import { useInfiniteQuery, useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';
export default function useAdvisorAdmin(){
 const {user}=useAuth(),enabled=user?.role==='admin',cache=useQueryClient();
 const [search,setSearch]=useState(''),[term,setTerm]=useState(''),[status,setStatus]=useState('all'),[selected,setSelected]=useState(null);
 useEffect(()=>{const timer=setTimeout(()=>setTerm(search.trim()),350);return()=>clearTimeout(timer);},[search]);
 const query={};
 if(status==='reports')query.status={$in:['completed','partial']};else if(status!=='all')query.status=status;
 if(term){const escaped=term.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');query.$or=[{website:{$regex:escaped,$options:'i'}},{project_name:{$regex:escaped,$options:'i'}}];}
 const requests=useInfiniteQuery({queryKey:['ai-advisor-admin','requests',query],enabled,initialPageParam:undefined,queryFn:({pageParam})=>base44.entities.AIAnalysisRequest.filter(query,{sort:'-created_date',limit:25,...(pageParam?{cursor:pageParam}:{})}),getNextPageParam:page=>page.has_more?page.next_cursor:undefined,retry:false,refetchOnWindowFocus:false});
 const metrics=useQuery({queryKey:['ai-advisor-admin','metrics'],enabled,queryFn:async()=>{const [summary,reports]=await Promise.all([base44.entities.AIAnalysisRequest.aggregate({groupBy:'status'}),base44.entities.AIIntegrationAnalysis.count({status:{$in:['completed','partial']}})]);const groups=Object.fromEntries(summary.rows.map(row=>[row.status,row.count]));return {total:summary.rows.reduce((n,row)=>n+row.count,0),reports,failed:groups.failed||0,active:(groups.queued||0)+(groups.researching||0)};},retry:false,refetchOnWindowFocus:false});
 const detail=useQuery({queryKey:['ai-advisor-admin','detail',selected],enabled:enabled&&Boolean(selected),queryFn:async()=>{const [request,page]=await Promise.all([base44.entities.AIAnalysisRequest.get(selected),base44.entities.AIIntegrationAnalysis.filter({request_id:selected},{sort:'-created_date',limit:1})]);return {request,analysis:page.items[0]||null};},retry:false,refetchOnWindowFocus:false});
 return {search,setSearch,status,setStatus,selected,setSelected,requests,metrics,detail,refresh:()=>cache.invalidateQueries({queryKey:['ai-advisor-admin']})};
}