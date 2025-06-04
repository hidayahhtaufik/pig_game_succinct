#![no_main]
sp1_zkvm::entrypoint!(main);

pub fn main() {
    // Read the winner's name as input (private input)
    let player_name = sp1_zkvm::io::read::<String>();
    
    // Validate the winner data
    assert!(!player_name.is_empty(), "Player name cannot be empty");
    assert!(player_name.len() <= 50, "Player name too long");
    
    // Basic validation for Pig Game winner format
    assert!(
        player_name.starts_with("Player ") && (
            player_name == "Player 1" || 
            player_name == "Player 2"
        ), 
        "Invalid player name format - must be 'Player 1' or 'Player 2'"
    );
    
    // Create a proof that this player is a legitimate winner
    let winner_proof = format!("SUCCINCT_PIG_GAME_WINNER:{}", player_name);
    
    // Commit the validated winner as public output
    sp1_zkvm::io::commit(&winner_proof);
}