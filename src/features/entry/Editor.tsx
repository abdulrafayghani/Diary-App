import React, { FC, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { rootState } from '../../rootReducer';
import Markdown from 'markdown-to-jsx';
import http from '../../services/api';
import { Entry } from '../../interfaces/entry.interface';
import { Diary } from '../../interfaces/diary.interface';
import { setCurrentlyEditing, setCanEdit } from './editorSlice';
import { updateDiary } from '../diary/diarySlice';
import { updateEntry } from '../entry/entrySlice';
import { showAlert } from '../../util';
import { useAppDispatch } from '../../store';

const Editor = () => {
  const { currentlyEditing: entry, canEdit, activeDiaryId } = useSelector(
    (state: rootState) => state.editor
  );

  const [editedEntry, updateEditedEntry] = useState(entry);
  const dispatch = useAppDispatch();

  const saveEntry = async () => {
    if (activeDiaryId == null) {
      showAlert('Please select a diary.', 'warning');
    }
    if (entry == null) {
      http
        .post<Entry, { diary: Diary; entry: Entry }>(
          `/diaries/entries/:${activeDiaryId}`,
          editedEntry
        )
        .then((data) => {
          if (data != null) {
            const { diary, entry: _entry } = data;
            dispatch(setCurrentlyEditing(_entry));
            dispatch(updateDiary(diary));
          }
        });
    } else {
      http
        .put<Entry, Entry>(`diaries/entries/:${entry.id}`, editedEntry)
        .then((_entry) => {
          if (_entry != null) {
            dispatch(setCurrentlyEditing(_entry));
            dispatch(updateEntry(_entry));
          }
        });
    }
    dispatch(setCanEdit(false));
  };

  useEffect(() => {
    updateEditedEntry(entry);
  }, [entry]);

  return (
    <div>
      <header
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          marginBottom: '0.2em',
          paddingBottom: '0.2em',
          borderBottom: '1px solid rgba(0,0,0,0.1)',
        }}
      >
          {entry && !canEdit ? (
              <h4>
                  {entry.title}
                  <a href="#edit"
                  onClick={(e)=>{
                    e.preventDefault()
                    if(entry != null){
                        dispatch(setCanEdit(true))
                    }
                  }}
                  style={{ marginLeft: '0.4em' }}  
                  >
                      (Edit)
                  </a>
              </h4>
          ) : (
              <input 
              value={editedEntry?.title ?? ''}
              disabled={!setCanEdit}
              onChange={(e)=>{
                  if(editedEntry){
                      updateEditedEntry({
                          ...editedEntry,
                          title: e.target.value,
                      })
                  }else{
                      updateEditedEntry({
                          title: e.target.value,
                          content: ''
                      })
                  }
              }}  
              />
          )}
      </header>
    </div>
  );
};

export default Editor;