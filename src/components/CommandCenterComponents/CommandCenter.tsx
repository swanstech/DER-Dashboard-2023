import React, { useContext, useEffect, useState } from 'react';
import { RangeSlider, Slider, Button, Alert } from '@mantine/core';
import {Bolt, FilePower, ChargingPile, CloudStorm, Battery, CircleHalf, BatteryCharging, AlertCircle} from 'tabler-icons-react';
import { AuthContext } from 'n/contexts/AuthContext';

export default function InverterCommandCenter({scopesArray}) {

 // const { userRoles } = useContext(AuthContext);
 

 
  const [editMode, setEditMode] = useState(false);
  
  //const [alertVisible, setAlertVisible] = useState(false);

  const [activePowerRate, setActivePowerRate] = useState([250, 800]);
  const [pfPowerValue, setPFPowerValue] = useState(50);
  const [approvedPowerRate, setApprovedPowerRate] = useState(50);
  const [reactivePower, setReactivePower] = useState([50, 100]);
  const [maxChargeRate, setMaxChargeRate] = useState([50, 100]);
  const [maxDischargeRate, setMaxDischargeRate] = useState([50, 100]);
  const [storageCapacity, setStorageCapacity] = useState(50);
  useEffect(() => {
    if (scopesArray.includes('write')) {
      setEditMode(true);
    }
  }, [scopesArray]);

  const activePowerMarks = [
    { value: 250, label: '250W' },
    { value: 500, label: '500W' },
    { value: 800, label: '800W' },
  ];

  const pfPowerMarks = [
    { value: 0, label: '0' },
    { value: 50, label: '50' },
    { value: 100, label: '100' },
    { value: 150, label: '150' },
  ];

  const reactivePowerMarks = [
    { value: 0, label: '0' },
    { value: 50, label: '50' },
    { value: 100, label: '100' },
    { value: 150, label: '150' },
    { value: 200, label: '200' },
  ];

  const maxChargeRateMarks = [
    { value: 0, label: '0W' },
    { value: 50, label: '50W' },
    { value: 100, label: '100W' },
    { value: 150, label: '150W' },
    { value: 200, label: '200W' },
  ];

  const maxDischargeRateMarks = [
    { value: 0, label: '0W' },
    { value: 50, label: '50W' },
    { value: 100, label: '100W' },
    { value: 150, label: '150W' },
    { value: 200, label: '200W' },
  ];

  const storageCapacityMarks = [
    { value: 0, label: '0Wh' },
    { value: 50, label: '50Wh' },
    { value: 100, label: '100Wh' },
    { value: 150, label: '150Wh' },
  ];
  // if (scopesArray.includes('edit')) {
  //   // If not in edit mode and 'edit' scope is not present, do nothing
  //   setEditMode(true);
  // }

  const handleEditSaveButton = () => {
    
    
  };
  return (
    <div className='command-center'>
      {editMode && (
        <div className="edit-button">
          <Button variant="outline" >
            {editMode ? "Edit" : "View"}
          </Button>
          <Button variant="outline" >
            Save
          </Button>
        </div>
      )}

      { <Alert icon={<AlertCircle size="1rem" />} title="Safety Alert!" color="red">
        You are going to make changes to the inverter settings. Please make sure you know what you are doing.
      </Alert>}

      <div className="slider">
        <label className="slider-label">
            Active Power Rate <Bolt size="1rem"/> 
        </label>
        <RangeSlider size="xs" disabled={!editMode} defaultValue={[250, 800]} onChange={setActivePowerRate} step={50} min={0} max={1000} color="yellow" marks={activePowerMarks}/>
        <div className="value-display-range">
            <div className="value-display">Min: {activePowerRate[0]}</div>
            <div className="value-display">Max: {activePowerRate[1]}</div>
        </div>
      </div>
      <div className="slider">
        <label className="slider-label">
                <p>PF Power Value</p>
                <FilePower size="1rem"/>
        </label>
        <Slider size="xs" disabled={!editMode} value={pfPowerValue} onChange={setPFPowerValue} min={0} max={150} color="yellow" marks={pfPowerMarks}/>
        <div className="value-display">Value: {pfPowerValue}</div>
      </div>
      <div className="slider">
        <label className="slider-label">
            Approved Power Rate <ChargingPile size="1rem"/>
        </label>
        <Slider size="xs" disabled={!editMode} value={approvedPowerRate} onChange={setApprovedPowerRate} min={0} max={100} color="yellow" />
        <div className="value-display">Value: {approvedPowerRate}</div>
      </div>
      <div className="slider">
        <label className="slider-label">
            Set Reactive Power <CloudStorm size="1rem"/>
        </label>
        <RangeSlider size="xs" disabled={!editMode} defaultValue={[50, 100]} onChange={setReactivePower} step={10} min={0} max={200} color="yellow" marks={reactivePowerMarks}/>
        <div className="value-display-range">
            <div className="value-display">Min: {reactivePower[0]}</div>
            <div className="value-display">Max: {reactivePower[1]}</div>
        </div>
      </div>
      <div className="slider">
        <label className="slider-label">
            Set Max Charge Rate <BatteryCharging size="1rem"/>
        </label>
        <RangeSlider size="xs" disabled={!editMode} defaultValue={[50, 100]} onChange={setMaxChargeRate} step={10} min={0} max={200} color="yellow" marks={maxChargeRateMarks} />
        <div className="value-display-range">
            <div className="value-display">Min: {maxChargeRate[0]}</div>
            <div className="value-display">Max: {maxChargeRate[1]}</div>
        </div>
      </div>
      <div className="slider">
        <label className="slider-label">
            Set Max Discharge Rate <Battery size="1rem"/>
        </label>
        <RangeSlider size="xs" disabled={!editMode} defaultValue={[50, 100]} onChange={setMaxDischargeRate} step={10} min={0} max={200} color="yellow" marks={maxDischargeRateMarks}/>
        <div className="value-display-range">
            <div className="value-display">Min: {maxDischargeRate[0]}</div>
            <div className="value-display">Max: {maxDischargeRate[1]}</div>
        </div>
      </div>
      <div className="slider">
        <label className="slider-label">
            Set Storage Capacity <CircleHalf size="1rem"/>
        </label>
        <Slider size="xs" disabled={!editMode} value={storageCapacity} onChange={setStorageCapacity} min={0} max={200} color="yellow" marks={storageCapacityMarks}/>
        <div className="value-display">Value: {storageCapacity}</div>
      </div>
      <style jsx>{`
        .command-center {
            margin: 0px;
            padding: 15px;
            height: 100%;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Add a subtle box shadow */
        }
        .slider {
            margin: 10px;
            width: 90%; /* Adjust as needed */
            margin-top: 0px;
            pointerEvents: editMode ? 'auto' : 'none';
        }
        .slider-label {
            display: block;
            margin-top: 20px;
            margin-bottom: 10px;
            font-size: 12px;
            display: flex;
        }
        .value-display-range {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
        }
        .value-display {
            display: none;
            padding: 10px;
            margin-top: 15px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Add a subtle box shadow */
            border-radius: 10px;
            font-style: italic;
            width: 15%;
        }
        .editButton{
            float: right;
        }
      `}</style>
    </div>
  );
}
