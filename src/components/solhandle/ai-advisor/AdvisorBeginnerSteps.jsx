import { advisorBeginnerSteps } from '@/components/solhandle/ai-advisor/advisorBeginnerSteps';
export default function AdvisorBeginnerSteps({ capability, stage }) {
 const guide = advisorBeginnerSteps[capability];
 if (!guide) return null;
 if (stage === 'inputs') return <div>
  <p><strong>What to pass to {guide.helper}:</strong></p>
  <ul>{guide.inputs.map(text => <li key={text}>{text}</li>)}</ul>
  <p>The call below belongs inside your server operation. Replace the example input names with your actual values. Return the result using your server framework’s response method; the comments are instructions, not a working API route.</p>
 </div>;
 return <div>
  <h4>5. Connect the screen to your server</h4>
  <ol>{guide.interface.map(text => <li key={text}>{text}</li>)}</ol>
  <h4>6. Check the result before going live</h4>
  <p>Run these checks in your development environment, alongside the project-specific checks in the proposal. They have not been run for this project.</p>
  <ul>{guide.checks.map(text => <li key={text}>{text}</li>)}</ul>
 </div>;
}