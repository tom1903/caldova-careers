import { describe, it, expect } from 'vitest';
import { filterJobs, sortByNewest, formatPostedDate } from './jobs';
import type { Job } from '../types/job';

function makeJob(slug: string, postedDate: string): Job {
    return {
        slug,
        title: `Role ${slug}`,
        department: 'Technology',
        location: 'Remote',
        type: 'Full-time',
        remote: true,
        postedDate,
        summary: 'A role.',
    };
}

describe('filterJobs', () => {
    const jobs = [
        { department: 'Technology', location: 'Remote' },
        { department: 'Finance', location: 'Woodinville' },
        { department: 'Finance', location: 'Helsinki' },
    ];

    it('returns all jobs when no filters are selected', () => {
        expect(filterJobs(jobs, {})).toEqual(jobs);
    });

    it('filters by department or location independently', () => {
        expect(filterJobs(jobs, { department: 'Finance' })).toEqual(jobs.slice(1));
        expect(filterJobs(jobs, { location: 'Remote' })).toEqual(jobs.slice(0, 1));
    });

    it('combines department and location filters', () => {
        expect(filterJobs(jobs, { department: 'Finance', location: 'Helsinki' }))
            .toEqual([jobs[2]]);
        expect(filterJobs(jobs, { department: 'Technology', location: 'Helsinki' }))
            .toEqual([]);
    });
});

describe('sortByNewest', () => {
    it('orders jobs by posted date, newest first', () => {
        const jobs = [
            makeJob('a', '2027-01-01'),
            makeJob('b', '2027-03-15'),
            makeJob('c', '2027-02-10'),
        ];
        expect(sortByNewest(jobs).map((j) => j.slug)).toEqual(['b', 'c', 'a']);
    });

    it('does not mutate the input array', () => {
        const jobs = [makeJob('a', '2027-01-01'), makeJob('b', '2027-03-15')];
        const original = jobs.map((j) => j.slug);
        sortByNewest(jobs);
        expect(jobs.map((j) => j.slug)).toEqual(original);
    });
});

describe('formatPostedDate', () => {
    it('formats an ISO date as a readable string', () => {
        expect(formatPostedDate('2027-01-05')).toBe('January 5, 2027');
    });

    it('returns the raw value when the date is unparseable', () => {
        expect(formatPostedDate('not-a-date')).toBe('not-a-date');
    });
});
