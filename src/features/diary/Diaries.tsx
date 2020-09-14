import React, { FC, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { rootState } from '../../rootReducer';
import http from '../../services/api';
import { Diary } from '../../interfaces/diary.interface';
import { addDiary } from './diarySlice';
import Swal from 'sweetalert2';
import { setUser } from '../auth/userSlice';
import DiaryTile from './DiaryTile';
import { User } from '../../interfaces/user.interface';
import { useAppDispatch } from '../../store';
import dayjs from 'dayjs';

const Diaries: FC = () => {
  const dispatch = useAppDispatch();
  const diaries = useSelector((state: rootState) => state.diaries);
  const user = useSelector((state: rootState) => state.user);

  useEffect(() => {
    const fetchDiairies = async () => {
      if (user) {
        http.get<null, Diary[]>(`diairies/:${user.id}`).then((data) => {
          if (data && data.length > 0) {
            const sortByUpatedAt = data.sort((a, b) => {
              return dayjs(b.updatedAt).unix() - dayjs(a.updatedAt).unix();
            });
            dispatch(addDiary(sortByUpatedAt));
          }
        });
      }
    };
    fetchDiairies();
  }, [dispatch, user]);

  const createDiary = async () => {
    const result: any = await Swal.mixin({
      input: 'text',
      confirmButtonText: 'Next →',
      showCancelButton: true,
      progressSteps: ['1', '2'],
    }).queue([
      {
        titleText: 'Diary title',
        input: 'text',
      },
      {
        titleText: 'Private or public diary?',
        input: 'radio',
        inputOptions: {
          private: 'Private',
          public: 'Public',
        },
        inputValue: 'private',
      },
    ]);
    if (result.value) {
      const { value } = result;
      const { diary, user: _user } = await http.post<
        Partial<Diary>,
        { diary: Diary; user: User }
      >('/diaries/', {
        title: value[0],
        type: value[1],
        userId: user?.id,
      });
      if (diary && user) {
        dispatch(addDiary([diary] as Diary[]));
        dispatch(addDiary([diary] as Diary[]));
        dispatch(setUser(_user));
        return Swal.fire({
          titleText: 'All done!',
          confirmButtonText: 'OK!',
        });
      }
    }
    Swal.fire({
      titleText: 'Cancelled',
    });
  };
  return (
    <div style={{ padding: '1em 0.4em' }}>
      {/* <Route path="/diary/:id">
        <DiaryEntriesList />
      </Route> */}
      <button onClick={createDiary}> Create New </button>
      {diaries.map((diary, idx) => (
        <DiaryTile key={idx} diary={diary} />
      ))}
    </div>
  );
};

export default Diaries;