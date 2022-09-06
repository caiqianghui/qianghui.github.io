import { View } from "@tarojs/components";
import React from "react";
import './styles.scss';

interface StepsItem {
  currentNum: number;
  title?: React.ReactNode;
  status: 'wait' | 'passed' | 'rejected' | 'wait_audit';
  description?: React.ReactNode;
  step: Array<any>;
}

export const Step = (props: StepsItem) => {
  const {title, status, description, currentNum, step} = props;

  return (
    <View className="steps">
      <View className="steps-left">
        <View className={'steps-left-step ' + `steps-${status}`}>
          <View className={'steps-left-step-check ' + `steps-${status}`} />
        </View>
        <View
          className={
            step.length === 1 || step.length === currentNum
              ? 'steps-flex'
              : 'steps-left-line'
          }
        />
      </View>
      <View className={'steps-flex'} style={{flexDirection: 'column'}}>
        <View className={'steps-title'}>{title}</View>
        <View>{description}</View>
      </View>
    </View>
  )
}

interface Props {
  children: React.ReactElement<any>[];
  current?: number;
}

export class Steps extends React.Component<Props> {
  render(): React.ReactNode {
    return this.props.children;
  }
}