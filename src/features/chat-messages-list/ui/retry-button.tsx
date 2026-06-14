import { fetchInitialMessages } from '@/entities/message';

import { useAppDispatch } from '@/shared/lib';
import { Button } from '@/shared/ui';

export function RetryButton() {
  const dispatch = useAppDispatch();

  const handleClick = () => {
    void dispatch(fetchInitialMessages());
  };

  return (
    <Button onClick={handleClick} type="button">
      Retry
    </Button>
  );
}
