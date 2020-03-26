const assert = require('assert')
const notify = require('../notify')
const schedule = require('node-schedule-tz')
const {Client} = require('discord.js')
const client = new Client()

describe('Notify Test Suite', function() {
    it('Message creation test no image', function() {
        let message = { dungeon: "This dungeon ", status: "will open in 12 hours."}
        assert.equal(notify.createMessage(message), `This dungeon will open in 12 hours.`);
    })

    it('Message creation test with image', function() {
        let message = { dungeon: "This dungeon ", status: "will open in 12 hours.", img: "\nhttps://imgur.com/eVboHcQ"}
        assert.equal(notify.createMessage(message), `This dungeon will open in 12 hours.\nhttps://imgur.com/eVboHcQ`);
    })

    it('Rule creation test', function() {
        let ruleObj = { hours: [0, 5, 7], min: 7}
        let rules = notify.setupRules(ruleObj);
        assert.equal(rules.length, 3)
        assert.equal(rules[0].minute, 7)
        assert.equal(rules[0].hour, 0)
        assert.equal(rules[1].minute, 7)
        assert.equal(rules[1].hour, 5)
        assert.equal(rules[2].minute, 7)
        assert.equal(rules[2].hour, 7)
    })

    it('Schedule job creation test', function() {
        let rule = new schedule.RecurrenceRule();
        rule.minute = 0;
        rule.hour = 5;
        let message = { dungeon: "This dungeon ", status: "will open in 12 hours.", img: "\nhttps://imgur.com/eVboHcQ", rule: rule, channel: client.channels.get(process.env.POST_CHANNEL_ID)}
        let job = notify.scheduleMessage(message);
        assert.equal(job.pendingInvocations()[0].recurrenceRule.recurs, true)
        assert.equal(job.pendingInvocations()[0].recurrenceRule.hour, 5)
        assert.equal(job.pendingInvocations()[0].recurrenceRule.minute, 0)
        assert.equal(job.pendingInvocations()[0].recurrenceRule.second, 0)
        job.cancel();
    })
});
