/* eslint-disable @typescript-eslint/indent */
import React, { useMemo, useState } from 'react';
import debounce from 'lodash.debounce';

import './App.scss';
import { peopleFromServer } from './data/people';
import { Dropdown } from './components/Dropdown';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [focused, setFocused] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  const handlePersonSelect = (person: Person) => {
    setSelectedPerson(person);
    setQuery(person.name);
  };

  const normalizedQuery = appliedQuery.trim().toLowerCase();

  const filteredPeople =
    normalizedQuery === ''
      ? peopleFromServer
      : peopleFromServer.filter(person =>
          person.name.toLowerCase().includes(normalizedQuery),
        );

  const debouncedSetAppliedQuery = useMemo(
    () => debounce((value: string) => setAppliedQuery(value), 300),
    [],
  );

  function handleQueryChange(event: React.ChangeEvent<HTMLInputElement>) {
    setQuery(event.target.value);
    debouncedSetAppliedQuery(event.target.value);

    if (selectedPerson) {
      setSelectedPerson(null);
    }
  }

  const noMatching = normalizedQuery !== '' && filteredPeople.length === 0;

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {(selectedPerson &&
            `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`) ||
            'No selected person'}
        </h1>

        <div className="dropdown is-active">
          <div className="dropdown-trigger">
            <input
              type="text"
              placeholder="Enter a part of the name"
              data-cy="search-input"
              className="input"
              value={query}
              onChange={handleQueryChange}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
            />
          </div>

          {focused && (
            <Dropdown people={filteredPeople} onSelected={handlePersonSelect} />
          )}
        </div>

        {noMatching && (
          <div
            // eslint-disable-next-line max-len
            className="notification is-danger is-light mt-3 is-align-self-flex-start"
            role="alert"
            data-cy="no-suggestions-message"
          >
            <p className="has-text-danger">No matching suggestions</p>
          </div>
        )}
      </main>
    </div>
  );
};
