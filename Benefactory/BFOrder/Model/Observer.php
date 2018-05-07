<?php

class Benefactory_BFOrder_Model_Observer extends Varien_Event_Observer
{
    protected $_base_url = "http://ttstaging.benefactory.in/api/v1/";
    protected $_client_id = "4";
    protected $_client_secret = "gzEh8dtKO5ILuOTd3rXXX5FPnGR9CQQFN5zd2Mov";
    protected $sku = 'benefactory_contribution';
    
    
    public function execute(Varien_Event_Observer $observer){
        
        $order = $observer->getEvent()->getOrder();
        $order_id = $order->getIncrementId();
        $name = $order->getCustomerName();
        $email = $order->getCustomerEmail();
        $phone = $order->getBillingAddress()->getTelephone();

        $should_send = false;
        
        foreach($order->getAllItems() as $item){
            if($item->getSku() == $this->sku){
                $should_send = true;
                break;
            }
        }

        if($should_send){
            $shippingAddress = $order->getShippingAddress();
			$billingAddress = $order->getBillingAddress();
			$customer = $order->getCustomerId(); 
			$customerName = $order->getCustomerName();
			
			if (strtolower($customerName) == "guest") {
				$customerName = $shippingAddress->getName();
			}
			
			$params = array('transaction_id'=> $order_id,
			              'customer_name' => $customerName, 
			              'customer_contact' => $shippingAddress->getTelephone(),
			              'customer_email' => $order->getCustomerEmail(),
			              'client_id' => $this->_client_id,
			              'client_secret' => $this->_client_secret
			              );
			
			$endpoint = "pending_contribution";
			
			if($order->getState() == 'canceled' || $order->getState() == 'closed') {
	            $endpoint = "refund_contribution";
	        } 
	        
	        else if($order->getState() == 'processing' || $order->getState() == 'complete') {
		        $endpoint = "paid_contribution";
	        }

            $headers = array('Content-Type','application/x-www-form-urlencoded');

            $curl = new Varien_Http_Adapter_Curl();
            $curl->write(Zend_Http_Client::POST, $this->_base_url . $endpoint, '1.0', $headers, $params);
            $data = $curl->read();
            $curl->close();
            foreach($data as $d){
                Mage::log($d, null, 'product-updates.log', true);                
            }
        }
    }
}
?>