//
//  HomeViewController.swift
//  Cryptex
//
//  Created by Cole Roberts on 8/7/17.
//  Copyright © 2017 Cole Roberts. All rights reserved.
//

import UIKit

class HomeViewController: UIViewController {
    
    // UI elements
    @IBOutlet weak var priceLabel: UILabel!
    
    var timer = Timer()
    
    func displayPriceData() {
        
        // Get the latest price data and display it
        getLatestPrice() {
            priceData in
            
            // let currency = priceData.data["currency"]
            let price = priceData.data["amount"]
            
            self.priceLabel.text = price
        }
    }

    
    func getLatestPrice(completionHandler: @escaping (_ priceData: Spot) -> ()) {
        
        guard let coinbaseApi = URL(string: "https://api.coinbase.com/v2/prices/BTC-USD/spot") else { return }
        
        URLSession.shared.dataTask(with: coinbaseApi) { (data, response, err) in
            
            guard let data = data else { return }
        
            do {
                let spotData = try JSONDecoder().decode(Spot.self, from: data)
                
                print(spotData)
                
                completionHandler(spotData)
            } catch let jsonErr {
                print(jsonErr)
            }
        }.resume()
    }
    
    func drawGradient() {
        self.view.backgroundColor = UIColor.red
        
        let gradientLayer = CAGradientLayer()
        
        gradientLayer.frame = self.view.bounds
        
        let color1 = UIColor(red:0.93, green:0.22, blue:0.28, alpha: 0.5).cgColor as CGColor
        let color2 = UIColor(red:0.94, green:0.38, blue:0.55, alpha: 0.8).cgColor as CGColor
        
        gradientLayer.colors = [color1, color2]
        gradientLayer.locations = [0.0, 1.0]
        
        self.view.layer.addSublayer(gradientLayer)
    }

    override func viewDidLoad() {
        super.viewDidLoad()
        // Do any additional setup after loading the view, typically from a nib.
    
        //drawGradient()
        displayPriceData()
        
        // Set the view background color
//        let black = UIColor(red: 16/255.0, green: 16/255.0, blue: 16/255.0, alpha: 1.0)
//        view.backgroundColor = black

        // Refresh the UI data every 10 seconds
        timer = Timer.scheduledTimer(withTimeInterval: 10, repeats: true) {_ in
            self.displayPriceData()
        }
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.

    }
}

