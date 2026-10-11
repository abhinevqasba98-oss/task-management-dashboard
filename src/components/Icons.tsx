import type { ComponentType } from "react";
import type { SvgIconProps } from "@mui/material/SvgIcon";
import CheckIcon from "@mui/icons-material/Check";
import WarningIcon from "@mui/icons-material/WarningAmber";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import AssignmentIcon from "@mui/icons-material/Assignment";
import ScheduleIcon from "@mui/icons-material/Schedule";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ViewListIcon from "@mui/icons-material/ViewList";
import AddIcon from "@mui/icons-material/Add";
import RefreshIcon from "@mui/icons-material/Refresh";
import SearchIcon from "@mui/icons-material/Search";
import TuneIcon from "@mui/icons-material/Tune";
import TrackChangesIcon from "@mui/icons-material/TrackChanges";
import CloseIcon from "@mui/icons-material/Close";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

type IconProps = SvgIconProps & { size?: number; strokeWidth?: number };
type IconComponent = ComponentType<SvgIconProps>;
function makeIcon(Icon: IconComponent) {
  return function MaterialIcon({ size, strokeWidth: _strokeWidth, sx, ...props }: IconProps) {
    return <Icon {...props} sx={{ fontSize: size ?? 20, ...sx }} />;
  };
}
export const Check = makeIcon(CheckIcon);
export const AlertCircle = makeIcon(WarningIcon);
export const ArrowDownUp = makeIcon(SwapVertIcon);
export const CheckCircle2 = makeIcon(CheckCircleIcon);
export const CircleDashed = makeIcon(RadioButtonUncheckedIcon);
export const ClipboardList = makeIcon(AssignmentIcon);
export const Clock3 = makeIcon(ScheduleIcon);
export const LayoutGrid = makeIcon(DashboardIcon);
export const List = makeIcon(ViewListIcon);
export const Plus = makeIcon(AddIcon);
export const RefreshCw = makeIcon(RefreshIcon);
export const Search = makeIcon(SearchIcon);
export const SlidersHorizontal = makeIcon(TuneIcon);
export const Target = makeIcon(TrackChangesIcon);
export const X = makeIcon(CloseIcon);
export const Activity = makeIcon(TrendingUpIcon);
export const CalendarDays = makeIcon(CalendarMonthIcon);
export const Pencil = makeIcon(EditIcon);
export const Trash2 = makeIcon(DeleteOutlineIcon);
