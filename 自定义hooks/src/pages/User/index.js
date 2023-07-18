import React from 'react';
import { useFollowSystem, useTheme } from '@/hooks/useTheme';
import { Switch, Radio } from 'antd';

const User = () => {
  const [followSystem, setFollowSystem] = useFollowSystem();
  const [theme, setTheme] = useTheme();

  return (
    <div>
      是否跟随系统主题？
      <Switch
        checkedChildren="跟随"
        unCheckedChildren="不跟随"
        defaultChecked={followSystem === 'Y'}
        onChange={(checked) => {
          setFollowSystem(checked ? 'Y' : 'N');
        }}
      />
      {
        followSystem !== 'Y' ? (
          <div>
            设置主题：
            <Radio.Group
              defaultValue={theme}
              onChange={(e) => {
                setTheme(e.target.value);
              }}
            >
              <Radio.Button value="light">浅色</Radio.Button>
              <Radio.Button value="dark">深色</Radio.Button>
            </Radio.Group>
          </div>
        ) : null
      }
    </div>
  );
};

export default User;
