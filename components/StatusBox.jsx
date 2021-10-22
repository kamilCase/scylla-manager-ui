import styled from "@emotion/styled";
import PropTypes from "prop-types";
import { statusType } from "utils/utils";

const IconContainer = styled.div(`
& > svg {
    width: 100%;
    height: 100%;
}
`);

const statusToColor = {
  [statusType.positive]: "text-green-500",
  [statusType.negative]: "text-red-500",
  [statusType.neutral]: "text-gray-500",
};

function StatusBox({ title, icon, status, description, value, unit }) {
  const statusColor = statusToColor[status];

  return (
    <div className="bg-white overflow-hidden shadow rounded-lg w-36 md:w-56 relative">
      {icon && (
        <IconContainer className="p-2 h-20 w-20 rounded-full absolute opacity-50 -right-2">
          {icon}
        </IconContainer>
      )}
      <div className="px-4 py-5 sm:p-6">
        <p className="text-sm leading-5 font-medium text-gray-500 truncate">
          {title.toUpperCase()}
        </p>
        <p className={`mt-1 text-3xl leading-9 font-semibold ${statusColor}`}>
          {description}
        </p>
        {value && unit && (
          <p className="text-gray-500 font-semibold">
            <span>
              {value}
              <span className="text-xs"></span> {unit}
            </span>
          </p>
        )}
      </div>
    </div>
  );
}

StatusBox.propTypes = {
  title: PropTypes.string,
  icon: PropTypes.element,
  status: PropTypes.oneOf([
    statusType.negative,
    statusType.neutral,
    statusType.positive,
  ]),
  description: PropTypes.string,
  value: PropTypes.string,
  unit: PropTypes.string,
};
export default StatusBox;
