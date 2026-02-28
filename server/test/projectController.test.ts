import test from 'node:test';
import assert from 'node:assert/strict';
import {
    deleteProject,
    generateAIWebsite,
    reviseWebsite,
} from '../controllers/projectController';
import { prisma } from '../lib/prisma';
import openai from '../configs/openai';

function createRes() {
    const res: any = {
        statusCode: 200,
        body: undefined,
        status(code: number) {
            this.statusCode = code;
            return this;
        },
        json(payload: unknown) {
            this.body = payload;
            return this;
        },
        send(payload: unknown) {
            this.body = payload;
            return this;
        },
    };
    return res;
}

test('deleteProject deletes when owned by user', async () => {
    (prisma.websiteProject.deleteMany as any) = async () => ({ count: 1 });

    const req: any = { params: { id: 'project-1' }, userId: 'user-1' };
    const res = createRes();

    await deleteProject(req, res);

    assert.equal(res.statusCode, 200);
    assert.deepEqual(res.body, { message: 'Project deleted' });
});

test('deleteProject returns 404 when project is not owned/found', async () => {
    (prisma.websiteProject.deleteMany as any) = async () => ({ count: 0 });

    const req: any = { params: { id: 'project-1' }, userId: 'other-user' };
    const res = createRes();

    await deleteProject(req, res);

    assert.equal(res.statusCode, 404);
    assert.deepEqual(res.body, { message: 'Project not found' });
});

test('generateAIWebsite returns 403 and does not call OpenAI when credits are exhausted', async () => {
    let openaiCalled = false;
    (prisma.user.findUnique as any) = async () => ({ id: 'user-1', credits: 0 });
    (openai.chat.completions.create as any) = async () => {
        openaiCalled = true;
        return { choices: [{ message: { content: 'ignored' } }] };
    };

    const req: any = { body: { prompt: 'build landing page', projectId: 'project-1' }, userId: 'user-1' };
    const res = createRes();

    await generateAIWebsite(req, res);

    assert.equal(res.statusCode, 403);
    assert.deepEqual(res.body, { message: 'Not enough credits' });
    assert.equal(openaiCalled, false);
});

test('reviseWebsite returns 403 and does not call OpenAI when user is missing', async () => {
    let openaiCalled = false;
    (prisma.user.findUnique as any) = async () => null;
    (openai.chat.completions.create as any) = async () => {
        openaiCalled = true;
        return { choices: [{ message: { content: 'ignored' } }] };
    };

    const req: any = {
        body: { prompt: 'change hero color', projectId: 'project-1', currentCode: '<html></html>' },
        userId: 'missing-user',
    };
    const res = createRes();

    await reviseWebsite(req, res);

    assert.equal(res.statusCode, 403);
    assert.deepEqual(res.body, { message: 'Not enough credits' });
    assert.equal(openaiCalled, false);
});
