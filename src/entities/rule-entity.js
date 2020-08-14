class RuleEntity {
    constructor(data) {
        this.rule = new schedule.RecurrenceRule()
        this.rule.minute = data.minute || 0
        this.rule.hour = data.hour
        this.rule.dayOfWeek = data.dayOfWeek
    }

    get minute() {
        return this.rule.minute
    }

    get hour() {
        return this.rule.hour
    }

    get dayOfWeek() {
        return this.rule.hour
    }

    get rule() {
        return this.rule
    }
}