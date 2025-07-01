
/**
 * Open a file in the configured editor.
 * Uses BACKLOG_EDITOR, VISUAL, or EDITOR environment variables.
 * Throws if no editor is configured or spawn fails.
 */
export async function openFileInEditor(filePath: string): Promise<void> {
        const editor =
                process.env.BACKLOG_EDITOR ||
                process.env.VISUAL ||
                process.env.EDITOR;

        if (!editor) {
                throw new Error(
                        "No editor configured. Set BACKLOG_EDITOR, VISUAL or EDITOR",
                );
        }

        const proc = Bun.spawn([editor, filePath], {
                stdin: "inherit",
                stdout: "inherit",
                stderr: "inherit",
        });
        await proc.exited;
}
