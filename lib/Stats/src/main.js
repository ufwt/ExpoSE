const SET_TAG = 'set';
const SEEN_TAG = 'seen';
const MAX_TAG = 'max';

class Stats {
	
	constructor() {
		this.data = {};
	}

	_entry(title) {
		
		//Create a new entry if it doesn't exist
		if (!this.data[title]) {
			this.data[title] = {};
		}

		return this.data[title];
	}

	_taggedEntry(title, tag) {
		const entry = this._entry(title);
		entry.tag = tag;
		return entry;
	}

	_getSet(entry) {
		
		if (!entry.payload) {
			entry.payload = new Set();
			entry.payload.toJSON = function() {
				return Array.from(entry.payload);
			}
		}

		return entry.payload;
	}

	set(title, item) {
		const entry = this._taggedEntry(title, SET_TAG);
		const set = this._getSet(entry);
		set.add(item);
	}

	seen(title) {
		const entry = this._taggedEntry(title, SEEN_TAG);
		entry.payload = entry.payload ? entry.payload + 1 : 1;
	}

	max(title, val) {
		const entry = this._taggedEntry(title, MAX_TAG);
		entry.payload = entry.payload ? Math.max(entry.payload, val) : val;
	}

	final() {
		return this.data;
	}

	export() {
		return JSON.stringify(this.data);
	}

	_mergeSet(data, title) {
		data[title].payload.forEach(item => this.set(title, item));
	}

	_mergeSeen(data, title) {

		//Just add the two payloads together for num stats
		let entry = this._taggedEntry(title, SEEN_TAG);

		if (!entry.payload) {
			entry.payload = 0;
		}

		entry.payload += data[title].payload;
	}

	_mergeMax(data, title) {
		let entry = this._taggedEntry(title, MAX_TAG);
		entry.payload = entry.payload || 0;
		entry.payload = Math.max(data[title].payload, entry.payload);
	}

	_mergeField(data, title) {
		switch (data[title].tag) {
			case SET_TAG:
				this._mergeSet(data, title);
				break;
			case SEEN_TAG:
				this._mergeSeen(data, title);
				break;
			case MAX_TAG:
				this._mergeMax(data, title);
				break;
			default:
				throw 'Bad Merge';
		}
	}

	merge(data) {
		data = JSON.parse(data);
		for (let entry in data) {
			this._mergeField(data, entry);
		}
	}
}

export default Stats;
