import * as assert from 'node:assert';
import test from 'node:test';
import { Relations, assemble } from './assemble';

test('assemble', () => {
  const objects = [{ 'j.jobNumber': 1 }, { 'j.jobNumber': 2 }];

  const relations = {};
  const aliases = {};
  const identifiers = ['j.jobNumber'];

  assert.deepStrictEqual(assemble(relations, aliases, identifiers, objects), [
    { jobNumber: 1 },
    { jobNumber: 2 },
  ]);
});

test('assemble hasMany single props', () => {
  const objects = [
    { 'j.jobNumber': 1, 'jl.locationId': 1 },
    { 'j.jobNumber': 1, 'jl.locationId': 2 },
    { 'j.jobNumber': 2, 'jl.locationId': 3 },
  ];

  const relations: Relations = {
    job: {
      job_location: ['hasMany', 'locations'],
    },
  };
  const aliases = {
    j: 'job',
    jl: 'job_location',
  };
  const identifiers = ['j.jobNumber', 'jl.locationId'];

  assert.deepStrictEqual(assemble(relations, aliases, identifiers, objects), [
    {
      jobNumber: 1,
      locations: [{ locationId: 1 }, { locationId: 2 }],
    },
    { jobNumber: 2, locations: [{ locationId: 3 }] },
  ]);
});

test('assemble hasMany null', () => {
  const objects = [
    { 'j.jobNumber': 1, 'jl.locationId': 1 },
    { 'j.jobNumber': 1, 'jl.locationId': 2 },
    { 'j.jobNumber': 2, 'jl.locationId': null },
  ];

  const relations: Relations = {
    job: {
      job_location: ['hasMany', 'locations'],
    },
  };
  const aliases = {
    j: 'job',
    jl: 'job_location',
  };
  const identifiers = ['j.jobNumber', 'jl.locationId'];

  assert.deepStrictEqual(assemble(relations, aliases, identifiers, objects), [
    {
      jobNumber: 1,
      locations: [{ locationId: 1 }, { locationId: 2 }],
    },
    { jobNumber: 2, locations: [] },
  ]);
});
