import { earnRetiredResponse } from '../../shared/earnRetirement.ts';
export default async function(req: Request): Promise<Response> {
  return earnRetiredResponse();
}