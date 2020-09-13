import React, { FC, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { rootState } from '../../rootReducer';
import http from '../../services/api';
import { Entry } from '../../interfaces/entry.interface';
import { setEntries } from '../entry/entrySlice';
import { setCurrentlyEditing, setCanEdit } from '../entry/editorSlice';
import dayjs from 'dayjs';
import { useAppDispatch } from '../../store';

const DiaryEntriesList: FC = () => {
    const { entries } = useSelector((state: rootState) => state )


    return (
        <div>
            
        </div>
    )
}

export default DiaryEntriesList
