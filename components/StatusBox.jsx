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
  [statusType.positive]: "green-500",
  [statusType.negative]: "red-500",
  [statusType.neutral]: "gray-500",
};

function StatusBox({ title, icon, status, description, value, unit }) {
  const statusColor = statusToColor[status];

  return (
    <div className="bg-white overflow-hidden shadow rounded-lg w-24 md:w-32 relative m-2">
      {/* <span className="relative inline-flex rounded-full h-3 w-3 bg-purple-500"></span> */}

      {icon && (
        <IconContainer className="p-2 h-12 w-12 rounded-full absolute opacity-50 -right-2">
          {icon}
        </IconContainer>
      )}
      <div className="px-4 py-5 sm:p-2">
        <p className="text-sm leading-5 font-medium text-gray-500 truncate">
          <span>
            {title.toUpperCase()}
            <span className="ml-2 h-3 w-3 inline-flex">
              <span
                className={`animate-ping absolute inline-flex h-3 w-3 rounded-full bg-${statusColor} opacity-75`}
              ></span>
              <span
                className={`relative inline-flex rounded-full h-3 w-3 bg-${statusColor}`}
              ></span>
            </span>
          </span>
        </p>
        <div className={`text-lg leading-8 font-semibold text-${statusColor}`}>
          {description}
          {value && unit && (
            <span className="text-gray-500 font-semibold text-xs pl-1">
              <span>
                ({value}
                <span className="text-xs"></span> {unit})
              </span>
            </span>
          )}
        </div>
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
