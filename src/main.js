import GithubService from './github.js';
import { throwIfMissing } from './utils.js';

export default async ({ res, req, log, error }) => {
  throwIfMissing(process.env, ['GITHUB_WEBHOOK_SECRET', 'GITHUB_TOKEN']);

  const github = new GithubService();

  if (!(await github.verifyWebhook(req))) {
    error('Invalid signature');
    return res.json({ ok: false, error: 'Invalid signature' }, 401);
  }

  if (!github.isIssueOpenedEvent(req)) {
    log('Received non-issue event - ignoring');
    return res.json({ ok: true });
  }


  await github.postComment(
    req.body.repository,
    req.body.issue,
    `Thank you for helping us improve our project. Someone from our team will respond soon!` //UPDATE THE COMMENT HERE
  );

  return res.json({ ok: true });
};
