import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Check, Clock, Package, Truck, ShoppingBag } from 'lucide-react-native';
import Colors from '@/constants/Colors';

interface OrderTrackerProps {
  status: 'pending' | 'confirmed' | 'preparing' | 'out_for_delivery' | 'delivered' | 'cancelled';
}

export default function OrderTracker({ status }: OrderTrackerProps) {
  const steps = [
    { id: 'confirmed', label: 'Order Confirmed', icon: Check },
    { id: 'preparing', label: 'Preparing', icon: Package },
    { id: 'out_for_delivery', label: 'Out for Delivery', icon: Truck },
    { id: 'delivered', label: 'Delivered', icon: ShoppingBag },
  ];

  const getStepStatus = (stepId: string) => {
    if (status === 'cancelled') return 'inactive';
    
    const statusOrder = ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered'];
    const currentIndex = statusOrder.indexOf(status);
    const stepIndex = statusOrder.indexOf(stepId);
    
    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'active';
    return 'inactive';
  };

  if (status === 'cancelled') {
    return (
      <View style={styles.cancelledContainer}>
        <Clock size={40} color={Colors.error} />
        <Text style={styles.cancelledText}>Order Cancelled</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {steps.map((step, index) => {
        const stepStatus = getStepStatus(step.id);
        const StepIcon = step.icon;
        
        return (
          <React.Fragment key={step.id}>
            <View style={styles.step}>
              <View 
                style={[
                  styles.iconContainer, 
                  stepStatus === 'completed' && styles.completedIcon,
                  stepStatus === 'active' && styles.activeIcon,
                ]}
              >
                <StepIcon 
                  size={20} 
                  color={stepStatus === 'inactive' ? Colors.darkGray : Colors.white} 
                />
              </View>
              <Text 
                style={[
                  styles.stepLabel,
                  stepStatus === 'completed' && styles.completedText,
                  stepStatus === 'active' && styles.activeText,
                ]}
              >
                {step.label}
              </Text>
            </View>
            
            {index < steps.length - 1 && (
              <View 
                style={[
                  styles.connector,
                  getStepStatus(steps[index + 1].id) === 'completed' && styles.completedConnector,
                ]} 
              />
            )}
          </React.Fragment>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  step: {
    alignItems: 'center',
    width: 80,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.lightGray,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  completedIcon: {
    backgroundColor: Colors.success,
  },
  activeIcon: {
    backgroundColor: Colors.primary,
  },
  stepLabel: {
    fontSize: 12,
    textAlign: 'center',
    color: Colors.darkGray,
  },
  completedText: {
    color: Colors.success,
    fontWeight: '500',
  },
  activeText: {
    color: Colors.primary,
    fontWeight: '600',
  },
  connector: {
    height: 2,
    flex: 1,
    backgroundColor: Colors.lightGray,
  },
  completedConnector: {
    backgroundColor: Colors.success,
  },
  cancelledContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 30,
  },
  cancelledText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.error,
    marginTop: 12,
  },
});