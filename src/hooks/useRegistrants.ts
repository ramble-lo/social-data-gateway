
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Registrant, RegistrationHistory, RegistrantWithHistory } from '@/types/registrant';
import { useToast } from '@/hooks/use-toast';

export const useRegistrants = () => {
  const [registrants, setRegistrants] = useState<RegistrantWithHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchRegistrants = async () => {
    try {
      setLoading(true);
      
      // 獲取所有報名者
      const { data: registrantsData, error: registrantsError } = await supabase
        .from('registrants')
        .select('*')
        .order('created_at', { ascending: false });

      if (registrantsError) throw registrantsError;

      // 獲取所有報名歷史
      const { data: historyData, error: historyError } = await supabase
        .from('registration_history')
        .select('*')
        .order('submit_time', { ascending: false });

      if (historyError) throw historyError;

      // 合併資料
      const registrantsWithHistory: RegistrantWithHistory[] = registrantsData.map(registrant => ({
        ...registrant,
        history: historyData.filter(history => history.registrant_id === registrant.id)
      }));

      setRegistrants(registrantsWithHistory);
    } catch (error) {
      console.error('Error fetching registrants:', error);
      toast({
        title: "獲取報名者資料失敗",
        description: "請稍後再試",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const migrateExistingData = async () => {
    try {
      // 這個函數將現有的報名資料遷移到新的資料結構
      const existingRegistrations = [
        {
          id: '1',
          activityName: '《FREE STYLE玩拼豆》2025/07/06 14:30-16:30',
          name: '張聿昕',
          gender: '男',
          age: '',
          email: 'morrielynn@gmail.com',
          phone: '0988992069',
          lineId: '',
          childrenCount: '',
          isResident: '否，我是文山區鄰近居民',
          housingLocation: '',
          sportsExperience: '',
          injuryHistory: '',
          infoSource: '',
          suggestions: '',
          submitTime: '2025-06-20 13:45:37',
        },
        {
          id: '2',
          activityName: '《你好，我是蛇》2025/07/06(日)10:30~12:00',
          name: '林玟琳',
          gender: '女',
          age: '29',
          email: 'hudi8505@gmail.com',
          phone: '0935973588',
          lineId: 'yeah8505',
          childrenCount: '',
          isResident: '是',
          housingLocation: '',
          sportsExperience: '',
          injuryHistory: '',
          infoSource: 'FB粉專（興隆社宅2區：興生活隆底家）',
          suggestions: '可以帶三歲小孩一起參加嗎',
          submitTime: '2025-06-20 13:50:03',
        },
        {
          id: '3',
          activityName: '《手作「興」生活—編織手工書》2025/7/30 14:00-16:00',
          name: '蔡孟錦',
          gender: '女',
          age: '',
          email: 'eva043142@gmail.com',
          phone: '0930431331',
          lineId: 'eva431331',
          childrenCount: '',
          isResident: '否，我是文山區鄰近居民',
          housingLocation: '',
          sportsExperience: '',
          injuryHistory: '',
          infoSource: 'FB粉專（興隆社宅2區：興生活隆底家）',
          suggestions: '謝謝辦理活動 辛苦了',
          submitTime: '2025-06-20 13:51:46',
        }
      ];

      for (const registration of existingRegistrations) {
        // 檢查報名者是否已存在
        const { data: existingRegistrant } = await supabase
          .from('registrants')
          .select('id')
          .eq('email', registration.email)
          .eq('phone', registration.phone)
          .single();

        let registrantId;

        if (!existingRegistrant) {
          // 建立新的報名者
          const { data: newRegistrant, error } = await supabase
            .from('registrants')
            .insert({
              name: registration.name,
              email: registration.email,
              phone: registration.phone,
              gender: registration.gender,
              line_id: registration.lineId || null,
              is_resident: registration.isResident.includes('是'),
              housing_location: registration.housingLocation || null
            })
            .select()
            .single();

          if (error) throw error;
          registrantId = newRegistrant.id;
        } else {
          registrantId = existingRegistrant.id;
        }

        // 新增報名歷史記錄
        const { error: historyError } = await supabase
          .from('registration_history')
          .insert({
            registrant_id: registrantId,
            activity_name: registration.activityName,
            age: registration.age || null,
            children_count: registration.childrenCount || null,
            sports_experience: registration.sportsExperience || null,
            injury_history: registration.injuryHistory || null,
            info_source: registration.infoSource || null,
            suggestions: registration.suggestions || null,
            submit_time: registration.submitTime
          });

        if (historyError) throw historyError;
      }

      toast({
        title: "資料遷移完成",
        description: "現有報名資料已成功遷移到新的資料結構"
      });

    } catch (error) {
      console.error('Error migrating data:', error);
      toast({
        title: "資料遷移失敗",
        description: "請稍後再試",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    fetchRegistrants();
  }, []);

  return {
    registrants,
    loading,
    fetchRegistrants,
    migrateExistingData
  };
};
