import { BUILD_LOGS, PROMPTS } from "@/lib/docs";
import { CopyButton } from "@/components/marketing/actions";
import AgentMap from "@/components/demo/AgentMap";
import AgentNotes from "@/components/docs/AgentNotes";
import Section from "@/components/Section";
import { GITHUB_URL } from "@/lib/site";

export default function DocsPage() {
  const weeks = [...new Set(PROMPTS.map((p) => p.week))];
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <header className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-wide text-black/50 dark:text-white/40">Build documentation</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight">Docs</h1>
        <p className="mt-2 max-w-2xl text-black/70 dark:text-white/60">
          How IBEROGO was built, week by week: the exact prompts given to the coding agent, what broke and what was fixed, and how each part
          works. Every commit is on{" "}
          <a href={GITHUB_URL} target="_blank" rel="noreferrer" className="text-red-600 hover:underline">
            GitHub
          </a>
          .
        </p>
        <nav aria-label="On this page" className="mt-4 flex flex-wrap gap-2 text-sm">
          {[
            ["#prompts", "Prompt library"],
            ["#logs", "Build logs"],
            ["#agent-map", "Agent map"],
            ["#how", "How each part works"],
          ].map(([href, label]) => (
            <a key={href} href={href} className="rounded-full border border-black/15 px-3 py-1 hover:border-red-600/60 dark:border-white/20">
              {label}
            </a>
          ))}
        </nav>
      </header>

      <div className="space-y-10">
        <Section
          id="prompts"
          title="Prompt library"
          zone="Output"
          intro={`${PROMPTS.length} coding-agent prompts (Codex / Claude Code), copied word for word from each week's plan. The plan always came first; the prompt only asked for what the plan agreed.`}
        >
          <div className="space-y-6" data-testid="prompt-library">
            {weeks.map((w) => (
              <div key={w}>
                <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-black/50 dark:text-white/40">{w}</h3>
                <ul className="space-y-3">
                  {PROMPTS.filter((p) => p.week === w).map((p) => (
                    <li key={p.id} className="rounded-lg border border-black/10 p-3 text-sm dark:border-white/10">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <p className="font-semibold">{p.purpose}</p>
                        {p.prompt && <CopyButton text={p.prompt} label="Copy prompt" />}
                      </div>
                      {p.prompt ? (
                        <details className="mt-2">
                          <summary className="cursor-pointer text-black/60 dark:text-white/50">Show the exact prompt</summary>
                          <p className="mt-2 rounded-md bg-black/5 p-3 font-mono text-xs whitespace-pre-wrap dark:bg-white/10">{p.prompt}</p>
                        </details>
                      ) : (
                        <p className="mt-1 text-black/50 dark:text-white/40">The exact prompt text is in the {p.week} submission document (not copied here).</p>
                      )}
                      <p className="mt-2 text-black/70 dark:text-white/60">Result: {p.result}</p>
                      <p className="mt-1 flex flex-wrap gap-x-1.5 text-xs text-black/50 dark:text-white/40">
                        <span>Commits:</span>
                        {p.commits.map((c) => (
                          <a key={c} href={`${GITHUB_URL}/commit/${c}`} target="_blank" rel="noreferrer" className="font-mono hover:text-red-600">
                            {c}
                          </a>
                        ))}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Section>

        <Section id="logs" title="Build logs" zone="Saved" intro="One entry per week: the goal, how it was tested, what broke and what was fixed.">
          <ol className="space-y-3" data-testid="build-logs">
            {BUILD_LOGS.map((l) => (
              <li key={l.week} className="rounded-lg border border-black/10 p-3 text-sm dark:border-white/10">
                <div className="flex flex-wrap items-baseline gap-x-2">
                  <span className="text-xs font-semibold uppercase tracking-wide text-black/50 dark:text-white/40">{l.week}</span>
                  <span className="font-semibold">{l.title}</span>
                  <code className="text-xs text-black/50 dark:text-white/40">{l.page}</code>
                  <span className="text-xs text-black/50 dark:text-white/40">· {l.commits} commits</span>
                </div>
                <dl className="mt-2 grid gap-1 sm:grid-cols-[90px_1fr]">
                  <dt className="text-black/50 dark:text-white/40">Goal</dt>
                  <dd>{l.goal}</dd>
                  <dt className="text-black/50 dark:text-white/40">Tested</dt>
                  <dd>{l.tests}</dd>
                  <dt className="text-black/50 dark:text-white/40">Broke</dt>
                  <dd>{l.broke}</dd>
                  <dt className="text-black/50 dark:text-white/40">Fixed</dt>
                  <dd>{l.fixed}</dd>
                </dl>
              </li>
            ))}
          </ol>
        </Section>

        <Section id="agent-map" title="Agent map" zone="Output" intro="Every part that acts like an agent, what kind it really is, and where its data goes.">
          <AgentMap />
        </Section>

        <Section id="how" title="How each part works" zone="Output" intro="The rules behind the simulated parts, written down so nothing is hidden.">
          <AgentNotes />
        </Section>
      </div>
    </div>
  );
}
