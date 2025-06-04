use sp1_sdk::{include_elf, utils, ProverClient, SP1Stdin};
use std::env;

// Include the compiled ELF of the pig game program
pub const PIG_GAME_ELF: &[u8] = include_elf!("pig-game-program");

fn main() {
    // Setup logging
    utils::setup_logger();
    
    // Get command-line arguments
    let args: Vec<String> = env::args().collect();
    if args.len() != 2 {
        eprintln!("Usage: {} <player_name>", args[0]);
        eprintln!("Example: {} \"Player 1\"", args[0]);
        std::process::exit(1);
    }
    
    let player_name = &args[1];
    println!("🎲 Generating Succinct SP1 proof for winner: {}", player_name);
    
    // Validate input format
    if !player_name.starts_with("Player ") {
        eprintln!("❌ Error: Player name must be 'Player 1' or 'Player 2'");
        std::process::exit(1);
    }
    
    // Setup input for the zkVM
    let mut stdin = SP1Stdin::new();
    stdin.write(&player_name.to_string());
    
    // Create ProverClient
    println!("🔧 Setting up Succinct SP1 prover...");
    let client = ProverClient::from_env();
    
    println!("🔧 Setting up proving and verifying keys...");
    let (pk, vk) = client.setup(PIG_GAME_ELF);
    
    // Generate proof
    println!("🔮 Generating zero-knowledge proof...");
    println!("⏳ This may take a moment...");
    
    match client.prove(&pk, &stdin).run() {
        Ok(proof) => {
            println!("✅ Proof generated successfully!");
            
            // Verify proof
            println!("🔍 Verifying proof...");
            match client.verify(&proof, &vk) {
                Ok(_) => {
                    println!("✅ Proof verified successfully!");
                    println!("🏆 {} is verified as the winner!", player_name);
                    
                    // Save proof (optional)
                    let proof_path = format!("succinct_pig_game_proof_{}.bin", 
                                           player_name.replace(" ", "_").to_lowercase());
                    
                    if let Err(e) = proof.save(&proof_path) {
                        eprintln!("⚠️  Warning: Failed to save proof to {}: {}", proof_path, e);
                    } else {
                        println!("💾 Proof saved to: {}", proof_path);
                    }
                    
                    println!("🎉 Succinct SP1 proof generation completed successfully!");
                }
                Err(e) => {
                    eprintln!("❌ Proof verification failed: {}", e);
                    eprintln!("🔧 Check your SP1 setup and try again");
                    std::process::exit(1);
                }
            }
        }
        Err(e) => {
            eprintln!("❌ Failed to generate proof: {}", e);
            eprintln!("🔧 Possible issues:");
            eprintln!("   - SP1 environment not properly configured");
            eprintln!("   - Invalid input format");
            eprintln!("   - System resources insufficient");
            std::process::exit(1);
        }
    }
}