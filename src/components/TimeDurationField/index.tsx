import {
  ClickAwayListener,
  Fade,
  IconButton,
  InputAdornment,
  ListItemText,
  MenuItem,
  MenuList,
  Paper,
  Popper,
  styled,
  TextField,
} from '@mui/material';
import { Box, SxProps } from '@mui/system';
import {
  ChangeEventHandler,
  forwardRef,
  MouseEventHandler,
  TouchEvent,
  useRef,
  useState,
} from 'react';
import { useElementSize } from '~/hooks/useElementSize';
import { ChevronDownIcon } from '~/icons/ChevronDown';
import { ChevronUpIcon } from '~/icons/ChevronUp';
import { color } from '~/themes/styles';
import { Time } from '~/utils/timeUtil';
import { ClearButton } from '../ClearButton';

const StyledTextField = styled(TextField)({
  '.MuiInputBase-input': {
    padding: '4px 4px 5px 8px',
    width: 20,
    textAlign: 'end',
  },
  '.MuiInput-root': {
    fontSize: 12,
    '::before': {
      borderBottom: 'unset !important',
    },
    '::after': {
      borderBottom: 'unset !important',
    },
  },
  '.MuiInputAdornment-root': {
    marginLeft: 0,
  },
  '.MuiTypography-root': {
    fontSize: 12,
  },
});

export const TimeDurationField = forwardRef(
  (
    {
      value,
      onChange,
      options = [],
      fullWidth,
      sx,
    }: {
      value: Time;
      onChange: (v: Time | null) => void;
      options: Time[];
      sx?: SxProps;
      fullWidth?: boolean;
    },
    ref
  ) => {
    const defaultValue = useRef(value);
    const [uncontrolledValue, setUncontrolledValue] = useState({
      hours: value?.hours ?? 0,
      minutes: value?.minutes ?? 0,
    });

    const [openOptions, setOpenOptions] = useState(false);
    const wrapperRef = useRef<HTMLDivElement | null>(null);
    const hourFieldRef = useRef<HTMLInputElement>(null);
    const minuteFieldRef = useRef<HTMLInputElement>(null);

    const [focused, setFocused] = useState<HTMLInputElement | null>(null);

    const [rect, sizeRef]: any = useElementSize();

    const controlledValue = value ?? uncontrolledValue;
    const controlledOnChange = onChange ?? setUncontrolledValue;

    const onChangeHour: ChangeEventHandler<HTMLInputElement> = (e) => {
      if (!/^\d*$/.test(e.target.value)) {
        return;
      }

      setUncontrolledValue({
        ...controlledValue,
        hours: Math.min(24, Number(e.target.value)),
      });

      controlledOnChange({
        ...controlledValue,
        hours: Math.min(24, Number(e.target.value)),
      });
    };

    const onChangeMinute: ChangeEventHandler<HTMLInputElement> = (e) => {
      if (!/^\d*$/.test(e.target.value)) {
        return;
      }

      setUncontrolledValue({
        ...controlledValue,
        minutes: Math.min(59, Number(e.target.value)),
      });

      controlledOnChange({
        ...controlledValue,
        minutes: Math.min(59, Number(e.target.value)),
      });
    };

    const onClickWrapper: MouseEventHandler = (e) => {
      if (e.target === wrapperRef.current) {
        minuteFieldRef.current?.focus();
      }

      setOpenOptions(true);
    };

    const onClickOption = (o: Time) => {
      onChange(o);
      setOpenOptions(false);
    };

    const onClickAway = (e: any) => {
      if (wrapperRef.current?.contains(e.target as Node)) {
        return;
      }

      setOpenOptions(false);
    };

    const onClickClear: MouseEventHandler = (e) => {
      e.stopPropagation();
      onChange(defaultValue.current);
      setOpenOptions(false);
    };

    const onFocusHourField = () => {
      setFocused(hourFieldRef.current);
    };

    const onFocusMinuteField = () => {
      setFocused(minuteFieldRef.current);
    };

    const onBlurHourField = () => {
      setFocused(null);
    };

    const onBlurMinuteField = () => {
      setFocused(null);
    };

    const onClickToggleOptions: MouseEventHandler = (e) => {
      e.stopPropagation();
      setOpenOptions((v) => !v);
    };

    const active = Boolean(focused) || openOptions;

    return (
      <>
        <Box
          ref={(node: HTMLDivElement) => {
            wrapperRef.current = node;
            sizeRef(node);
            if (typeof ref === 'function') {
              ref(node);
            } else if (ref) {
              ref.current = node;
            }
          }}
          sx={{
            display: 'flex',
            border: '1px solid',
            borderColor: active ? color.primary.unoblue : color.line,
            borderRadius: 1,
            height: 29,
            width: fullWidth ? '100%' : undefined,
            ...sx,
          }}
          onClick={onClickWrapper}
        >
          <Box
            sx={{
              flexGrow: 1,
              display: 'flex',
              justifyContent: 'flex-start',
            }}
          >
            <Box
              sx={{
                display: 'grid',
                gridAutoColumns: 'minmax(0, 1fr)',
                gridAutoFlow: 'column',
              }}
            >
              <StyledTextField
                inputRef={hourFieldRef}
                value={controlledValue.hours}
                onChange={onChangeHour}
                onFocus={onFocusHourField}
                onBlur={onBlurHourField}
                InputProps={{
                  endAdornment: (
                    <InputAdornment
                      onClick={() => hourFieldRef.current?.focus()}
                      position="end"
                    >
                      시간
                    </InputAdornment>
                  ),
                }}
                variant="standard"
              />
              <StyledTextField
                inputRef={minuteFieldRef}
                value={controlledValue.minutes}
                onChange={onChangeMinute}
                onFocus={onFocusMinuteField}
                onBlur={onBlurMinuteField}
                InputProps={{
                  endAdornment: (
                    <InputAdornment
                      onClick={() => minuteFieldRef.current?.focus()}
                      position="end"
                    >
                      분
                    </InputAdornment>
                  ),
                }}
                variant="standard"
              />
            </Box>
          </Box>
          <Fade in={active}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <ClearButton onClick={onClickClear} />
            </Box>
          </Fade>
          <IconButton onClick={onClickToggleOptions}>
            {openOptions ? (
              <ChevronUpIcon fontSize="xs" />
            ) : (
              <ChevronDownIcon fontSize="xs" />
            )}
          </IconButton>
        </Box>
        <Popper
          open={openOptions}
          anchorEl={() => wrapperRef.current as HTMLDivElement}
          sx={{ zIndex: 1300 }}
        >
          <ClickAwayListener onClickAway={onClickAway}>
            <Paper
              sx={{ width: rect?.width, maxHeight: 240, overflow: 'auto' }}
            >
              <MenuList>
                {options.map((o) => (
                  <MenuItem
                    key={`${o.hours}-${o.minutes}`}
                    onClick={() => onClickOption(o)}
                  >
                    <ListItemText
                      sx={{
                        '.MuiTypography-root': {
                          fontSize: 12,
                        },
                      }}
                      primary={`${o.hours}시간 ${o.minutes}분`}
                    />
                  </MenuItem>
                ))}
              </MenuList>
            </Paper>
          </ClickAwayListener>
        </Popper>
      </>
    );
  }
);
