import React, { useState, useEffect, useRef, createRef } from 'react';

const getCheckbox = (options) => {
  const {name} = options;
  return <>
    <input type="checkbox" id={name} name={name} value={name} />
    <label htmlFor={name}>{name}</label>
  </>
}

const getRange = (options) => {
  const {name, min, max, step} = options;
  return <>
    <label htmlFor={name}>{name}</label>
    <input type="range" id={name} name={name} min={min} max={max} step={step} value={name} />
  </>
}

const getRadioGroup = (options) => {
  const {name, radioGroupValues} = options;
  console.log({name, radioGroupValues});
  const valueArray = radioGroupValues?.split(",").map(value => value.trim());
  return <>
    <div>{name}:</div>
    {valueArray?.map(value => {
      return <>
        <input type="radio" id={value} name={name} value={value} />
        <label htmlFor={value}>{value}</label>
      </>
    })}
  </>
}

const MetaForm = () => {
  const [selectedOption, setSelectedOption] = useState();
  const [options, setOptions] = useState({});
  const [lastFocus, setLastFocus] = useState();

  const refMap = {
    name: useRef(createRef()),
    radioGroupValues: useRef(createRef()),
    min: useRef(createRef()),
    max: useRef(createRef()),
    step: useRef(createRef()),
    output: useRef(createRef()),
  };

  useEffect(()=>{
    lastFocus?.current?.focus();
  });

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
    setOptions({});
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;   
    console.log( { name, value } ); 
    setOptions( (prevOptions) => ({
      ...prevOptions,
      [name]: value,
    }));
  };

  const getTextInput = (name, displayName, value) => {
    const myThing = <>
      <label htmlFor={name}>{displayName}:</label>
      <br />
      <input
        type="text"
        name={name}
        id={name}
        placeholder={displayName}
        value={value}
        onChange={handleInputChange}
        key={name}
        ref={refMap[name]}
        onFocus={(evt)=>setLastFocus(refMap[evt.target.name])}
      />
      <br />
    </>;
    return myThing;
}
  
  const BaseFormControl = ({ children }) => (
    <div>
      {getTextInput("name", "Name", options["name"])}
      {children}
    </div>
  );

  const renderFormControl = () => {
    switch (selectedOption) {
      case 'range':
        return (
          <BaseFormControl>
            <label htmlFor="min">Min:</label>
            <br />
            <input
              type="number"
              name="min"
              id="min"
              placeholder="Min"
              value={options.min || ''}
              onChange={handleInputChange}
              key="min"
              ref={refMap["min"]}
              onFocus={(evt)=>setLastFocus(refMap[evt.target.name])}
            />
            <br />
            <label htmlFor="max">Max:</label>
            <br />
            <input
              type="number"
              name="max"
              id="max"
              placeholder="Max"
              value={options.max || ''}
              onChange={handleInputChange}
              key="max"
              ref={refMap["max"]}
              onFocus={(evt)=>setLastFocus(refMap[evt.target.name])}
            />
            <br />
            <label htmlFor="step">Step:</label>
            <br />
            <input
              type="number"
              name="step"
              id="step"
              placeholder="Step"
              value={options.step || ''}
              onChange={handleInputChange}
              key="step"
              ref={refMap["step"]}
              onFocus={(evt)=>setLastFocus(refMap[evt.target.name])}
            />
          </BaseFormControl>
        );
      case 'checkbox':
        return <BaseFormControl />;
      case 'radioGroup':
        return (
          <BaseFormControl>
            {getTextInput('radioGroupValues', "Values", options['radioGroupValues'])}
          </BaseFormControl>
        );
      default:
        return null;
    }
  };

  const getDescribedElement = (selectedOption, options) => {
    switch (selectedOption) {
      case 'range':  
        return getRange(options);
      case 'checkbox':
        return getCheckbox(options);
      case 'radioGroup':
        console.log(options);
        return getRadioGroup(options);
      default: 
        return <span>error</span>;
    }
  }

  return <>
      <div style={{ padding: 'auto' }} key="MetaForm">
        <div
          style={{
            border: '1px solid #ccc',
            padding: '10px',
            width: '15%',
            minWidth: '200px',
          }}
        >
          <div 
          style={{
            border: '1px solid #ccc',
            padding: '10px',
            width: '15%',
            minWidth: '180px',
          }}>
            {getDescribedElement(selectedOption, options)}
          </div>
          <div>
            <label htmlFor="select">Select an option:</label>
            <select
              id="controlSelect"
              value={selectedOption}
              onChange={handleOptionChange}
              key="controlSelect"
            >
              <option value="">Select one</option>
              <option value="range">Range</option>
              <option value="checkbox">Checkbox</option>
              <option value="radioGroup">Radio Group</option>
            </select>
          </div>
          <div>{renderFormControl()}</div>
          <div>
            <textarea
              rows="5"
              cols="50"
              name="output"
              value={JSON.stringify(options, null, 2)}
              style={{ width: '90%' }}
              onChange={(e) => setOptions(JSON.parse(e.target.value))}
              key="output"
              ref={refMap["output"]}
              //onFocus={(evt)=>setLastFocus(refMap[evt.target.name])}
            />
          </div>
        </div>
      </div>
    </>
};

export default MetaForm;