import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import { spawnSync } from "node:child_process";
import { rm } from "node:fs/promises";
import { join } from "node:path";
import { Core } from "../core/backlog.ts";

const TEST_DIR = join(process.cwd(), "test-desc-notes");
const CLI_PATH = join(process.cwd(), "src", "cli.ts");

describe("Description and Notes CLI", () => {
	beforeEach(async () => {
		try {
			await rm(TEST_DIR, { recursive: true, force: true });
		} catch {
			// ignore
		}
		await Bun.spawn(["mkdir", "-p", TEST_DIR]).exited;
		await Bun.spawn(["git", "init"], { cwd: TEST_DIR }).exited;
		await Bun.spawn(["git", "config", "user.name", "Test User"], { cwd: TEST_DIR }).exited;
		await Bun.spawn(["git", "config", "user.email", "test@example.com"], { cwd: TEST_DIR }).exited;

		const core = new Core(TEST_DIR);
		await core.initializeProject("Desc Notes Test");
	});

	afterEach(async () => {
		try {
			await rm(TEST_DIR, { recursive: true, force: true });
		} catch {
			// ignore
		}
	});

	it("should update description using describe command", async () => {
		const core = new Core(TEST_DIR);
		await core.createTask(
			{
				id: "task-1",
				title: "Test",
				status: "To Do",
				assignee: [],
				createdDate: "2025-06-19",
				labels: [],
				dependencies: [],
				description: "## Description\n\nInitial",
			},
			false,
		);

		const result = spawnSync("bun", [CLI_PATH, "task", "describe", "1", "Updated description"], {
			cwd: TEST_DIR,
			encoding: "utf8",
		});
		expect(result.status).toBe(0);

		const task = await core.filesystem.loadTask("task-1");
		expect(task?.description).toContain("## Description");
		expect(task?.description).toContain("Updated description");
	});

	it("should update implementation notes using notes command", async () => {
		const core = new Core(TEST_DIR);
		await core.createTask(
			{
				id: "task-1",
				title: "Test",
				status: "To Do",
				assignee: [],
				createdDate: "2025-06-19",
				labels: [],
				dependencies: [],
				description: "## Description\n\nInitial",
			},
			false,
		);

		const result = spawnSync("bun", [CLI_PATH, "task", "notes", "1", "Some notes"], {
			cwd: TEST_DIR,
			encoding: "utf8",
		});
		expect(result.status).toBe(0);

		const task = await core.filesystem.loadTask("task-1");
		expect(task?.description).toContain("## Implementation Notes");
		expect(task?.description).toContain("Some notes");
	});
});
