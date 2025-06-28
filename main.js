import { faker } from '@faker-js/faker';
import { Kafka } from 'kafkajs';

const generateRandomContent = () => {
    return {
        user_id: faker.string.uuid(),
        user_message_id: faker.string.uuid(),
        assistant_message_id: faker.string.uuid(),
        chat_id: faker.string.uuid(),
        steps: {
            translation: {
                model: {
                    provider: faker.company.name(),
                    model: faker.word.noun(),
                },
                system_prompt: faker.lorem.sentence(),
                user_prompt: faker.lorem.sentence(),
                request_tokens: faker.number.int({ min: 100, max: 1000 }),
                assistant_response: faker.lorem.paragraph(),
                template_input_data: {
                    text: faker.lorem.sentence(),
                    has_history: faker.datatype.boolean(),
                },
                latency: faker.number.int({ min: 100, max: 1000 }),
                timestamp: faker.date.past()
            },
            preprocessing: {
                model: {
                    provider: faker.company.name(),
                    model: faker.word.noun(),
                },
                system_prompt: faker.lorem.sentence(),
                user_prompt: faker.lorem.sentence(),
                request_tokens: faker.number.int({ min: 100, max: 1000 }),
                assistant_response: faker.lorem.paragraph(),
                template_input_data: {
                    text: faker.lorem.sentence(),
                    has_history: faker.datatype.boolean(),
                },
                latency: faker.number.int({ min: 100, max: 500 }),
                timestamp: faker.date.past()
            },
            title: {
                model: {
                    provider: faker.company.name(),
                    model: faker.word.noun(),
                },
                system_prompt: faker.lorem.sentence(),
                user_prompt: faker.lorem.sentence(),
                request_tokens: faker.number.int({ min: 100, max: 1000 }),
                assistant_response: faker.lorem.paragraph(),
                template_input_data: {
                    text: faker.lorem.sentence(),
                    has_history: faker.datatype.boolean(),
                },
                latency: faker.number.int({ min: 100, max: 500 }),
                timestamp: faker.date.past()
            },
            chat: {
                model: {
                    provider: faker.company.name(),
                    model: faker.word.noun(),
                },
                system_prompt: faker.lorem.sentence(),
                user_prompt: faker.lorem.sentence(),
                request_tokens: faker.number.int({ min: 100, max: 1000 }),
                assistant_response: faker.lorem.paragraph(),
                template_input_data: {
                    text: faker.lorem.sentence(),
                    has_history: faker.datatype.boolean(),
                },
                latency: faker.number.int({ min: 100, max: 500 }),
                timestamp: faker.date.past()
            }
        },
        create_date: faker.date.past()
    };
};

function getRandomItem(arr) {
    if (!Array.isArray(arr) || arr.length === 0) {
        throw new Error("Input must be a non-empty array");
    }
    const randomIndex = Math.floor(Math.random() * arr.length);
    return arr[randomIndex];
}

const main = async () => {
    const kafka = new Kafka({
        clientId: 'nodejs-producer',
        brokers: ['localhost:9092', 'localhost:9093', 'localhost:9094'],
    });
    const producer = kafka.producer();

    try {
        await producer.connect();
        console.log('Producer connected');

        const topics = ['faker-data-1', 'faker-data-2', 'faker-data-3'];
        const messageHeaders = ['message-header-1', 'message-header-2',];

        setInterval(async () => {
            const content = generateRandomContent();
            const message = JSON.stringify(content);

            const response = await producer.send({
                topic: getRandomItem(topics),
                messages: [
                    {
                        key: JSON.stringify({ message_id: faker.string.uuid() }),
                        value: message,
                        headers: {
                            source: Buffer.from(getRandomItem(messageHeaders)),
                        },
                    },
                ],
            });

            console.log('Message sent:', response);
        }, 5000);

    } catch (error) {
        console.error('Error connecting producer:', error);
        return;
    }
};

main();
